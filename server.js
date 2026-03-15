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

// ── Helper: read state from JSONBin (with local cache fallback) ──
async function readState() {
  try {
    const resp = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_KEY },
    });
    if (resp.ok) {
      const body = await resp.json();
      const data = body.record || {};
      // Cache locally
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
      return data;
    }
  } catch (e) {
    console.warn('JSONBin read failed, using local cache:', e.message);
  }
  // Fallback to local file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      if (raw.trim()) return JSON.parse(raw);
    }
  } catch (e) { /* ignore */ }
  return {};
}

// ── Helper: write state to JSONBin (and local cache) ──
async function writeState(data) {
  // Always write local cache first (fast)
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  // Then persist to JSONBin (async, don't block response)
  try {
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY,
      },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.warn('JSONBin write failed:', e.message);
  }
}

// ── GET /api/state ──────────────────────────────────────────
app.get('/api/state', async (req, res) => {
  try {
    const data = await readState();
    res.json(data);
  } catch (e) {
    console.error('GET /api/state error:', e.message);
    res.json({});
  }
});

// ── POST /api/state ─────────────────────────────────────────
// Smart merge: admin fields overwrite, picks merge per-player
app.post('/api/state', async (req, res) => {
  try {
    // Read existing state
    let existing = await readState();

    const incoming = req.body;
    const sender = incoming._sender; // player ID of the sender

    // Admin fields always overwrite
    const adminFields = ['currentRound', 'roundStatus', 'results', 'players', 'rulesText', 'defaultPlayersKey', 'bonusAnswers', 'playerPins'];
    adminFields.forEach(field => {
      if (incoming[field] !== undefined) {
        existing[field] = incoming[field];
      }
    });

    // Picks: deep-merge — only update picks for the sender, keep others untouched
    if (incoming.picks && sender) {
      if (!existing.picks) existing.picks = {};
      existing.picks[sender] = incoming.picks[sender] || {};
    } else if (incoming.picks && !sender) {
      existing.picks = incoming.picks;
    }

    // Bonus picks: deep-merge per sender, same as regular picks
    if (incoming.bonusPicks && sender) {
      if (!existing.bonusPicks) existing.bonusPicks = {};
      existing.bonusPicks[sender] = incoming.bonusPicks[sender] || {};
    } else if (incoming.bonusPicks && !sender) {
      existing.bonusPicks = incoming.bonusPicks;
    }

    // currentPlayer is per-browser, don't store on server
    // (each client tracks their own currentPlayer locally)

    await writeState(existing);
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /api/state error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── ESPN SCORES ──────────────────────────────────────────────
// Fetch live/final scores from ESPN's public API
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard';

// Tournament dates by round (March Madness 2026)
const TOURNAMENT_DATES = [
  '20260317', '20260318',  // First Four
  '20260319', '20260320',  // Round of 64
  '20260321', '20260322',  // Round of 32
  '20260327', '20260328',  // Sweet 16
  '20260329', '20260330',  // Elite 8 (sometimes same weekend)
  '20260404', '20260405',  // Final Four
  '20260407',              // Championship
];

let cachedScores = {};
let lastScoresFetch = 0;
const SCORES_CACHE_MS = 60000; // refresh every 60 seconds

async function fetchESPNScores() {
  const now = Date.now();
  if (now - lastScoresFetch < SCORES_CACHE_MS) return cachedScores;

  const scores = {};
  // Only fetch dates that are today or in the past (plus today +1 for timezone)
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const tomorrow = new Date(today.getTime() + 86400000);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10).replace(/-/g, '');

  const datesToFetch = TOURNAMENT_DATES.filter(d => d <= tomorrowStr);
  if (datesToFetch.length === 0) return cachedScores;

  for (const date of datesToFetch) {
    try {
      const resp = await fetch(`${ESPN_BASE}?dates=${date}&groups=100`);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (!data.events) continue;

      for (const event of data.events) {
        const comp = event.competitions?.[0];
        if (!comp) continue;
        const status = comp.status?.type?.state || 'pre'; // pre, in, post
        if (status === 'pre') continue; // skip games that haven't started

        const teams = comp.competitors || [];
        if (teams.length < 2) continue;

        // ESPN lists home team first, away second (or vice versa)
        const team1 = teams[0];
        const team2 = teams[1];

        const gameName = event.shortName || '';
        scores[gameName] = {
          t1: { name: team1.team?.shortDisplayName || team1.team?.displayName || '', score: parseInt(team1.score) || 0, seed: team1.curatedRank?.current || 0 },
          t2: { name: team2.team?.shortDisplayName || team2.team?.displayName || '', score: parseInt(team2.score) || 0, seed: team2.curatedRank?.current || 0 },
          status: status, // 'in' = live, 'post' = final
          statusDetail: comp.status?.type?.shortDetail || '',
          clock: comp.status?.displayClock || '',
          period: comp.status?.period || 0,
        };
      }
    } catch (e) {
      console.warn(`ESPN fetch failed for ${date}:`, e.message);
    }
  }

  cachedScores = scores;
  lastScoresFetch = now;
  return scores;
}

// API endpoint for client to get scores
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await fetchESPNScores();
    res.json(scores);
  } catch (e) {
    console.error('GET /api/scores error:', e.message);
    res.json({});
  }
});

app.listen(PORT, () => {
  console.log(`March Madness Pool running at http://localhost:${PORT}`);
});
