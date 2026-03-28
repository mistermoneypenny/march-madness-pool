const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'state.json');

// JSONBin.io persistent storage
const JSONBIN_ID  = '69b73e47b7ec241ddc6fe337';
const JSONBIN_KEY = process.env.JSONBIN_KEY || '$2a$10$W6vNvtSScYKU7ztHnivVI.1PhiLvrklCsgk5GcOXtdi.Kg6Ppd2c6';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

// ── IN-MEMORY STATE CACHE ────────────────────────────────────
// Avoid hammering JSONBin on every poll (8 clients × every 8s = 60 reads/min)
let memoryState = null;
let lastJsonBinRead = 0;
const JSONBIN_READ_INTERVAL = 30000; // only read from JSONBin every 30s

// ── WRITE MUTEX ──────────────────────────────────────────────
// Prevents race conditions when multiple players save simultaneously
let writeLock = Promise.resolve();

function withWriteLock(fn) {
  const next = writeLock.then(fn).catch(fn);
  writeLock = next.then(() => {}, () => {});
  return next;
}

// ── SIMPLE RATE LIMITER ──────────────────────────────────────
const requestCounts = {};
const RATE_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS = 30;   // max per window per IP

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (!requestCounts[ip] || now - requestCounts[ip].start > RATE_WINDOW) {
    requestCounts[ip] = { start: now, count: 1 };
  } else {
    requestCounts[ip].count++;
  }
  if (requestCounts[ip].count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
}
app.use('/api/', rateLimit);

// Clean up rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const ip in requestCounts) {
    if (now - requestCounts[ip].start > RATE_WINDOW * 2) delete requestCounts[ip];
  }
}, 60000);

// ── Helper: read state (memory → JSONBin → local file) ──────
async function readState() {
  const now = Date.now();

  // Return memory cache if fresh
  if (memoryState && (now - lastJsonBinRead < JSONBIN_READ_INTERVAL)) {
    return memoryState;
  }

  // Try JSONBin
  try {
    const resp = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_KEY },
    });
    if (resp.ok) {
      const body = await resp.json();
      const data = body.record || {};
      memoryState = data;
      lastJsonBinRead = now;
      // Cache locally (atomic write: write to temp, then rename)
      const tmpFile = DATA_FILE + '.tmp';
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tmpFile, DATA_FILE);
      return data;
    }
  } catch (e) {
    console.warn('JSONBin read failed, using cache:', e.message);
  }

  // Return memory cache even if stale
  if (memoryState) return memoryState;

  // Last resort: local file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      if (raw.trim()) {
        memoryState = JSON.parse(raw);
        return memoryState;
      }
    }
  } catch (e) { /* ignore */ }
  return {};
}

// ── Helper: write state to memory + local + JSONBin ─────────
async function writeState(data) {
  // Update memory cache immediately
  memoryState = data;
  lastJsonBinRead = Date.now();

  // Write local cache (atomic)
  try {
    const tmpFile = DATA_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpFile, DATA_FILE);
  } catch (e) {
    console.warn('Local write failed:', e.message);
  }

  // Persist to JSONBin (with retry)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const resp = await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_KEY,
        },
        body: JSON.stringify(data),
      });
      if (resp.ok) return; // success
      console.warn(`JSONBin write attempt ${attempt + 1} failed: ${resp.status}`);
    } catch (e) {
      console.warn(`JSONBin write attempt ${attempt + 1} error:`, e.message);
    }
    // Brief delay before retry
    if (attempt === 0) await new Promise(r => setTimeout(r, 1000));
  }
}

// ── Helper: check if sender is admin ────────────────────────
function isAdminSender(sender, state) {
  return !sender || (state.players?.length && sender === state.players[0]?.id);
}

// ── GET /api/state ──────────────────────────────────────────
// PINs included in response (needed by admin to manage them, and by
// login overlay to show lock icons). Server-side validation via
// /api/login ensures PINs are always checked properly.
app.get('/api/state', async (req, res) => {
  try {
    const data = await readState();
    res.json(data);
  } catch (e) {
    console.error('GET /api/state error:', e.message);
    res.json({});
  }
});

// ── POST /api/login ─────────────────────────────────────────
// Server-side PIN validation
app.post('/api/login', async (req, res) => {
  try {
    const { playerId, pin } = req.body;
    if (!playerId) return res.status(400).json({ ok: false, error: 'Missing playerId' });

    const data = await readState();
    const storedPin = data.playerPins?.[playerId];

    if (!storedPin) {
      // No PIN set → allow login
      return res.json({ ok: true });
    }
    if (String(pin).trim() === String(storedPin).trim()) {
      return res.json({ ok: true });
    }
    return res.status(401).json({ ok: false, error: 'Incorrect PIN' });
  } catch (e) {
    console.error('POST /api/login error:', e.message);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ── POST /api/state ─────────────────────────────────────────
// Smart merge with write lock to prevent race conditions
app.post('/api/state', async (req, res) => {
  try {
    const result = await withWriteLock(async () => {
      // Read existing state (from memory cache — fast)
      let existing = await readState();

      const incoming = req.body;
      const sender = incoming._sender; // player ID of the sender
      const admin = isAdminSender(sender, existing);

      // ── ADMIN-ONLY FIELDS ──
      // Only admin (or no-sender bulk saves) can modify these
      if (admin) {
        const adminFields = ['currentRound', 'roundStatus', 'results', 'rulesText',
                             'defaultPlayersKey', 'bonusAnswers'];
        adminFields.forEach(field => {
          if (incoming[field] !== undefined) {
            existing[field] = incoming[field];
          }
        });

        // Players: only overwrite if sender is the actual admin player ID.
        // No-sender requests (like init seeding) must NOT overwrite existing players.
        if (incoming.players !== undefined) {
          const hasExistingPlayers = existing.players && existing.players.length > 0;
          const isRealAdmin = sender && existing.players?.length && sender === existing.players[0]?.id;
          if (isRealAdmin || !hasExistingPlayers) {
            existing.players = incoming.players;
          }
          // If no sender and existing players exist → keep existing (prevents init() overwrite)
        }
        // Only overwrite PINs if the incoming value has actual PINs set,
        // OR if there are no existing PINs. This prevents accidental wipes.
        if (incoming.playerPins !== undefined) {
          const hasIncomingPins = Object.keys(incoming.playerPins).length > 0;
          const hasExistingPins = existing.playerPins && Object.keys(existing.playerPins).length > 0;
          if (hasIncomingPins || !hasExistingPins) {
            existing.playerPins = incoming.playerPins;
          }
          // If incoming is empty but existing has PINs → keep existing (safety net)
        }
      }

      // ── PICKS: deep-merge per sender, per round ──
      if (incoming.picks && sender) {
        if (!existing.picks) existing.picks = {};
        if (!existing.picks[sender]) existing.picks[sender] = {};
        const senderPicks = incoming.picks[sender] || {};
        // Merge each round individually so saving R64 doesn't wipe R32 etc.
        for (const roundId of Object.keys(senderPicks)) {
          existing.picks[sender][roundId] = senderPicks[roundId];
        }
      } else if (incoming.picks && admin) {
        // Admin bulk save — overwrite all picks (for demo/reset)
        existing.picks = incoming.picks;
      }

      // ── BONUS PICKS: deep-merge per sender ──
      if (incoming.bonusPicks && sender) {
        if (!existing.bonusPicks) existing.bonusPicks = {};
        existing.bonusPicks[sender] = incoming.bonusPicks[sender] || {};
      } else if (incoming.bonusPicks && !sender) {
        existing.bonusPicks = incoming.bonusPicks;
      }

      await writeState(existing);
      return { ok: true };
    });
    res.json(result);
  } catch (e) {
    console.error('POST /api/state error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── HEALTH CHECK ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    memoryCache: !!memoryState,
    lastJsonBinSync: lastJsonBinRead ? new Date(lastJsonBinRead).toISOString() : null,
  });
});

// ── ESPN SCORES ──────────────────────────────────────────────
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard';

const TOURNAMENT_DATES = [
  '20260317', '20260318',  // First Four
  '20260319', '20260320',  // Round of 64
  '20260321', '20260322',  // Round of 32
  '20260327', '20260328',  // Sweet 16
  '20260329', '20260330',  // Elite 8
  '20260404', '20260405',  // Final Four
  '20260407',              // Championship
];

let cachedScores = {};
let lastScoresFetch = 0;
const SCORES_CACHE_MS = 60000;

async function fetchESPNScores() {
  const now = Date.now();
  if (now - lastScoresFetch < SCORES_CACHE_MS) return cachedScores;

  const scores = {};
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const tomorrow = new Date(today.getTime() + 86400000);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10).replace(/-/g, '');

  const datesToFetch = TOURNAMENT_DATES.filter(d => d <= tomorrowStr);
  if (datesToFetch.length === 0) return cachedScores;

  // Fetch all dates in parallel for faster response
  const results = await Promise.allSettled(
    datesToFetch.map(async (date) => {
      const resp = await fetch(`${ESPN_BASE}?dates=${date}&groups=100`);
      if (!resp.ok) return [];
      const data = await resp.json();
      return data.events || [];
    })
  );

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const event of result.value) {
      const comp = event.competitions?.[0];
      if (!comp) continue;
      const status = comp.status?.type?.state || 'pre';
      if (status === 'pre') continue;

      const teams = comp.competitors || [];
      if (teams.length < 2) continue;

      const team1 = teams[0];
      const team2 = teams[1];

      const gameName = event.shortName || '';
      scores[gameName] = {
        t1: { name: team1.team?.shortDisplayName || team1.team?.displayName || '', score: parseInt(team1.score) || 0, seed: team1.curatedRank?.current || 0 },
        t2: { name: team2.team?.shortDisplayName || team2.team?.displayName || '', score: parseInt(team2.score) || 0, seed: team2.curatedRank?.current || 0 },
        status: status,
        statusDetail: comp.status?.type?.shortDetail || '',
        clock: comp.status?.displayClock || '',
        period: comp.status?.period || 0,
      };
    }
  }

  cachedScores = scores;
  lastScoresFetch = now;
  return scores;
}

app.get('/api/scores', async (req, res) => {
  try {
    const scores = await fetchESPNScores();
    // Auto-update results from completed games
    await autoUpdateResults(scores);
    res.json(scores);
  } catch (e) {
    console.error('GET /api/scores error:', e.message);
    res.json({});
  }
});

// ── SERVER-SIDE AUTO-RESULTS ────────────────────────────────
// Bracket teams per region (same as client app.js INITIAL_TEAMS)
const BRACKET_TEAMS = {
  east: [
    { seed: 1, name: 'Duke' }, { seed: 16, name: 'Siena' },
    { seed: 8, name: 'Ohio State' }, { seed: 9, name: 'TCU' },
    { seed: 5, name: "St John's" }, { seed: 12, name: 'Northern Iowa' },
    { seed: 4, name: 'Kansas' }, { seed: 13, name: 'CA Baptist' },
    { seed: 6, name: 'Louisville' }, { seed: 11, name: 'South Florida' },
    { seed: 3, name: 'Michigan St' }, { seed: 14, name: 'N Dakota St' },
    { seed: 7, name: 'UCLA' }, { seed: 10, name: 'UCF' },
    { seed: 2, name: 'UConn' }, { seed: 15, name: 'Furman' },
  ],
  west: [
    { seed: 1, name: 'Arizona' }, { seed: 16, name: 'Long Island' },
    { seed: 8, name: 'Villanova' }, { seed: 9, name: 'Utah State' },
    { seed: 5, name: 'Wisconsin' }, { seed: 12, name: 'High Point' },
    { seed: 4, name: 'Arkansas' }, { seed: 13, name: "Hawai'i" },
    { seed: 6, name: 'BYU' }, { seed: 11, name: 'Texas' },
    { seed: 3, name: 'Gonzaga' }, { seed: 14, name: 'Kennesaw St' },
    { seed: 7, name: 'Miami' }, { seed: 10, name: 'Missouri' },
    { seed: 2, name: 'Purdue' }, { seed: 15, name: 'Queens' },
  ],
  south: [
    { seed: 1, name: 'Florida' }, { seed: 16, name: 'Prairie View' },
    { seed: 8, name: 'Clemson' }, { seed: 9, name: 'Iowa' },
    { seed: 5, name: 'Vanderbilt' }, { seed: 12, name: 'McNeese' },
    { seed: 4, name: 'Nebraska' }, { seed: 13, name: 'Troy' },
    { seed: 6, name: 'North Carolina' }, { seed: 11, name: 'VCU' },
    { seed: 3, name: 'Illinois' }, { seed: 14, name: 'Penn' },
    { seed: 7, name: "Saint Mary's" }, { seed: 10, name: 'Texas A&M' },
    { seed: 2, name: 'Houston' }, { seed: 15, name: 'Idaho' },
  ],
  midwest: [
    { seed: 1, name: 'Michigan' }, { seed: 16, name: 'Howard' },
    { seed: 8, name: 'Georgia' }, { seed: 9, name: 'Saint Louis' },
    { seed: 5, name: 'Texas Tech' }, { seed: 12, name: 'Akron' },
    { seed: 4, name: 'Alabama' }, { seed: 13, name: 'Hofstra' },
    { seed: 6, name: 'Tennessee' }, { seed: 11, name: 'Miami OH' },
    { seed: 3, name: 'Virginia' }, { seed: 14, name: 'Wright St' },
    { seed: 7, name: 'Kentucky' }, { seed: 10, name: 'Santa Clara' },
    { seed: 2, name: 'Iowa State' }, { seed: 15, name: 'Tennessee St' },
  ],
};

const REGIONS = ['east', 'west', 'south', 'midwest'];
const F4_PAIRINGS = [['west', 'east'], ['south', 'midwest']];

// Build game-to-teams mapping (mirrors client buildGames logic)
function buildServerGames(results) {
  const games = {};
  // R64: 8 games per region
  for (const region of REGIONS) {
    const teams = BRACKET_TEAMS[region];
    for (let i = 0; i < 8; i++) {
      const id = `r64-${region}-${i}`;
      games[id] = { id, round: 'r64', region, t1: teams[i*2], t2: teams[i*2+1] };
    }
  }
  // R32: 4 games per region — teams come from R64 winners
  for (const region of REGIONS) {
    for (let i = 0; i < 4; i++) {
      const p1 = `r64-${region}-${i*2}`;
      const p2 = `r64-${region}-${i*2+1}`;
      const id = `r32-${region}-${i}`;
      const t1 = results[p1] ? findTeamByName(results[p1]) : null;
      const t2 = results[p2] ? findTeamByName(results[p2]) : null;
      games[id] = { id, round: 'r32', region, t1, t2 };
    }
  }
  // S16: 2 games per region
  for (const region of REGIONS) {
    for (let i = 0; i < 2; i++) {
      const p1 = `r32-${region}-${i*2}`;
      const p2 = `r32-${region}-${i*2+1}`;
      const id = `s16-${region}-${i}`;
      const t1 = results[p1] ? findTeamByName(results[p1]) : null;
      const t2 = results[p2] ? findTeamByName(results[p2]) : null;
      games[id] = { id, round: 's16', region, t1, t2 };
    }
  }
  // E8: 1 game per region
  for (const region of REGIONS) {
    const p1 = `s16-${region}-0`;
    const p2 = `s16-${region}-1`;
    const id = `e8-${region}-0`;
    const t1 = results[p1] ? findTeamByName(results[p1]) : null;
    const t2 = results[p2] ? findTeamByName(results[p2]) : null;
    games[id] = { id, round: 'e8', region, t1, t2 };
  }
  // F4
  F4_PAIRINGS.forEach(([r1, r2], i) => {
    const p1 = `e8-${r1}-0`;
    const p2 = `e8-${r2}-0`;
    const id = `f4-${i}`;
    const t1 = results[p1] ? findTeamByName(results[p1]) : null;
    const t2 = results[p2] ? findTeamByName(results[p2]) : null;
    games[id] = { id, round: 'f4', region: null, t1, t2 };
  });
  // Championship
  const cid = 'champ-0';
  const ct1 = results['f4-0'] ? findTeamByName(results['f4-0']) : null;
  const ct2 = results['f4-1'] ? findTeamByName(results['f4-1']) : null;
  games[cid] = { id: cid, round: 'champ', region: null, t1: ct1, t2: ct2 };

  return games;
}

// Find team object by name across all regions
function findTeamByName(name) {
  for (const region of REGIONS) {
    const t = BRACKET_TEAMS[region].find(t => t.name === name);
    if (t) return t;
  }
  return { name, seed: 0 };
}

// Fuzzy match ESPN team name to our bracket team name
function matchTeamName(espnName, bracketName) {
  const e = espnName.toLowerCase().trim();
  const b = bracketName.toLowerCase().trim();
  if (e === b) return true;
  if (e.includes(b) || b.includes(e)) return true;
  // Handle common variations
  const aliases = {
    "st john's": ["st. john's", "saint john's", "st john's"],
    "michigan st": ["michigan state", "mich st", "mich. st"],
    "iowa state": ["iowa st", "iowa st."],
    "ohio state": ["ohio st", "ohio st."],
    "texas tech": ["texas tech"],
    "texas a&m": ["texas am", "texas a&m"],
    "n dakota st": ["north dakota state", "n dakota st", "ndsu", "north dakota st"],
    "south florida": ["usf", "south florida", "s florida"],
    "utah state": ["utah st", "utah st."],
    "saint louis": ["st louis", "st. louis", "slu"],
    "northern iowa": ["n iowa", "uni", "northern iowa"],
    "ca baptist": ["cal baptist", "california baptist", "cbu"],
    "miami oh": ["miami (oh)", "miami ohio"],
    "miami": ["miami (fl)", "miami fl"],
    "santa clara": ["santa clara"],
    "wright st": ["wright state", "wright st."],
    "kennesaw st": ["kennesaw state", "kennesaw st."],
    "tennessee st": ["tennessee state", "tennessee st."],
    "saint mary's": ["st mary's", "st. mary's", "saint mary's"],
    "north carolina": ["unc", "n carolina"],
    "high point": ["high point"],
    "prairie view": ["prairie view a&m", "prairie view"],
  };
  for (const [key, vals] of Object.entries(aliases)) {
    if (b === key && vals.some(v => e.includes(v) || v.includes(e))) return true;
    if (vals.some(v => b === v) && (e === key || e.includes(key))) return true;
  }
  return false;
}

async function autoUpdateResults(scores) {
  if (!scores || !Object.keys(scores).length) return;
  if (!memoryState) return;

  const results = memoryState.results || {};
  const games = buildServerGames(results);
  let newResults = 0;

  for (const game of Object.values(games)) {
    if (results[game.id]) continue; // already decided
    if (!game.t1 || !game.t2) continue; // teams not yet known

    // Find matching ESPN score
    let matched = null;
    for (const sc of Object.values(scores)) {
      if (sc.status !== 'post') continue;
      const e1 = sc.t1.name, e2 = sc.t2.name;
      if (matchTeamName(e1, game.t1.name) && matchTeamName(e2, game.t2.name)) {
        matched = { winner: sc.t1.score > sc.t2.score ? game.t1.name : game.t2.name };
        break;
      }
      if (matchTeamName(e1, game.t2.name) && matchTeamName(e2, game.t1.name)) {
        matched = { winner: sc.t1.score > sc.t2.score ? game.t2.name : game.t1.name };
        break;
      }
    }
    if (matched) {
      results[game.id] = matched.winner;
      newResults++;
      console.log(`Auto-result: ${game.id} → ${matched.winner}`);
    }
  }

  if (newResults > 0) {
    memoryState.results = results;
    try {
      await writeState(memoryState);
      console.log(`Auto-updated ${newResults} result(s) from ESPN`);
    } catch (e) {
      console.error('Failed to save auto-results:', e.message);
    }
  }
}

// ── GRACEFUL SHUTDOWN ────────────────────────────────────────
async function shutdown(signal) {
  console.log(`\n${signal} received. Syncing state to JSONBin...`);
  if (memoryState) {
    try {
      await writeState(memoryState);
      console.log('State synced. Shutting down.');
    } catch (e) {
      console.error('Final sync failed:', e.message);
    }
  }
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

app.listen(PORT, () => {
  console.log(`March Madness Pool running at http://localhost:${PORT}`);
});
