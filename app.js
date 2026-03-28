/* ============================================================
   MARCH MADNESS PICK-BY-ROUND POOL
   ============================================================
   Replace INITIAL_TEAMS with your actual 2026 bracket teams.
   The seeding order for each region (16 entries) must be:
   [1,16, 8,9, 5,12, 4,13, 6,11, 3,14, 7,10, 2,15]
   ============================================================ */

// ── CONSTANTS ─────────────────────────────────────────────────

const ROUND_CONFIG = [
  { id: 'r64',   label: 'Round of 64',  short: 'R64',  pts: 1,  multiplier: 1.0 },
  { id: 'r32',   label: 'Round of 32',  short: 'R32',  pts: 2,  multiplier: 1.2 },
  { id: 's16',   label: 'Sweet 16',     short: 'S16',  pts: 4,  multiplier: 1.4 },
  { id: 'e8',    label: 'Elite 8',      short: 'E8',   pts: 6,  multiplier: 1.6 },
  { id: 'f4',    label: 'Final Four',   short: 'F4',   pts: 8,  multiplier: 1.8 },
  { id: 'champ', label: 'Championship', short: 'CHMP', pts: 12, multiplier: 2.0 },
];


// -- CONFERENCE LIST (for bonus dropdown) ---------------------------------
const CONFERENCES = [
  'America East Conference',
  'American Athletic Conference',
  'Atlantic 10 Conference',
  'Atlantic Coast Conference (ACC)',
  'Atlantic Sun Conference (ASUN)',
  'Big 12 Conference',
  'Big East Conference',
  'Big Sky Conference',
  'Big South Conference',
  'Big Ten Conference',
  'Big West Conference',
  'Colonial Athletic Association (CAA)',
  'Conference USA',
  'Horizon League',
  'Ivy League',
  'Metro Atlantic Athletic Conference (MAAC)',
  'Mid-Eastern Athletic Conference (MEAC)',
  'Mid-American Conference (MAC)',
  'Missouri Valley Conference',
  'Mountain West Conference',
  'Northeast Conference (NEC)',
  'Ohio Valley Conference (OVC)',
  'Pac-12 Conference',
  'Patriot League',
  'Southeastern Conference (SEC)',
  'Southern Conference (SoCon)',
  'Southland Conference',
  'Southwestern Athletic Conference (SWAC)',
  'Summit League',
  'Sun Belt Conference',
  'West Coast Conference (WCC)',
];

// -- BONUS QUESTIONS PER ROUND ----------------------------------------
const BONUS_CONFIG = {
  r64: [
    { id: 'r64_conf', label: 'Most Successful Conference', points: 4, type: 'select', options: CONFERENCES },
  ],
  r32: [
    { id: 'r32_buzzer', label: 'Correct Number of Buzzer Beaters', points: 6, type: 'select', options: Array.from({length: 33}, (_, i) => String(i)) },
  ],
  s16: [
    { id: 's16_diff', label: 'Highest Point Differential', points: 8, type: 'select', options: Array.from({length: 61}, (_, i) => String(i)) },
  ],
  e8: [
    { id: 'e8_scorer', label: 'High Scorer (Player Name)', points: 10, type: 'text' },
    { id: 'e8_teams', label: 'Name the Four Elite Eight Winners', points: 25, type: 'multi', count: 4 },
  ],
  f4: [
    { id: 'f4_team3', label: 'Team with Most 3-Pointers', points: 6, type: 'select', options: '__ALL_TEAMS__' },
    { id: 'f4_num3', label: 'Number of 3-Pointers Made', points: 6, type: 'select', options: Array.from({length: 41}, (_, i) => String(i)) },
  ],
};

const REGIONS = ['East', 'West', 'South', 'Midwest'];

// Quadrant layout: left col (top→bottom) | right col (top→bottom)
const LEFT_REGIONS  = ['West', 'East'];
const RIGHT_REGIONS = ['South', 'Midwest'];

// Left side (West + East) → F4 game 0
// Right side (South + Midwest) → F4 game 1
const F4_PAIRINGS = [
  ['West', 'East'],
  ['South', 'Midwest'],
];

// ── 2025-26 NCAA TOURNAMENT BRACKET ───────────────────────────
// Order within each region (pair by pair): 1vs16, 8vs9, 5vs12, 4vs13, 6vs11, 3vs14, 7vs10, 2vs15
// First Four TBD slots filled with play-in winner placeholders
const INITIAL_TEAMS = {
  East: [
    { seed: 1,  name: 'Duke'         },
    { seed: 16, name: 'Siena'        },
    { seed: 8,  name: 'Ohio State'   },
    { seed: 9,  name: 'TCU'          },
    { seed: 5,  name: "St John's"    },
    { seed: 12, name: 'Northern Iowa'},
    { seed: 4,  name: 'Kansas'       },
    { seed: 13, name: 'CA Baptist'   },
    { seed: 6,  name: 'Louisville'   },
    { seed: 11, name: 'South Florida'},
    { seed: 3,  name: 'Michigan St'  },
    { seed: 14, name: 'N Dakota St'  },
    { seed: 7,  name: 'UCLA'         },
    { seed: 10, name: 'UCF'          },
    { seed: 2,  name: 'UConn'        },
    { seed: 15, name: 'Furman'       },
  ],
  West: [
    { seed: 1,  name: 'Arizona'      },
    { seed: 16, name: 'Long Island'  },
    { seed: 8,  name: 'Villanova'    },
    { seed: 9,  name: 'Utah State'   },
    { seed: 5,  name: 'Wisconsin'    },
    { seed: 12, name: 'High Point'   },
    { seed: 4,  name: 'Arkansas'     },
    { seed: 13, name: "Hawai'i"      },
    { seed: 6,  name: 'BYU'          },
    { seed: 11, name: 'Texas'        },
    { seed: 3,  name: 'Gonzaga'      },
    { seed: 14, name: 'Kennesaw St'  },
    { seed: 7,  name: 'Miami'        },
    { seed: 10, name: 'Missouri'     },
    { seed: 2,  name: 'Purdue'       },
    { seed: 15, name: 'Queens'       },
  ],
  South: [
    { seed: 1,  name: 'Florida'      },
    { seed: 16, name: 'Prairie View'  },
    { seed: 8,  name: 'Clemson'      },
    { seed: 9,  name: 'Iowa'         },
    { seed: 5,  name: 'Vanderbilt'   },
    { seed: 12, name: 'McNeese'      },
    { seed: 4,  name: 'Nebraska'     },
    { seed: 13, name: 'Troy'         },
    { seed: 6,  name: 'North Carolina'},
    { seed: 11, name: 'VCU'          },
    { seed: 3,  name: 'Illinois'     },
    { seed: 14, name: 'Penn'         },
    { seed: 7,  name: "Saint Mary's" },
    { seed: 10, name: 'Texas A&M'    },
    { seed: 2,  name: 'Houston'      },
    { seed: 15, name: 'Idaho'        },
  ],
  Midwest: [
    { seed: 1,  name: 'Michigan'     },
    { seed: 16, name: 'Howard'        },
    { seed: 8,  name: 'Georgia'      },
    { seed: 9,  name: 'Saint Louis'  },
    { seed: 5,  name: 'Texas Tech'   },
    { seed: 12, name: 'Akron'        },
    { seed: 4,  name: 'Alabama'      },
    { seed: 13, name: 'Hofstra'      },
    { seed: 6,  name: 'Tennessee'    },
    { seed: 11, name: 'Miami OH'      },
    { seed: 3,  name: 'Virginia'     },
    { seed: 14, name: 'Wright St'    },
    { seed: 7,  name: 'Kentucky'     },
    { seed: 10, name: 'Santa Clara'  },
    { seed: 2,  name: 'Iowa State'   },
    { seed: 15, name: 'Tennessee St' },
  ],
};

// Build sorted list of all tournament team names for dropdowns
const ALL_TEAM_NAMES = Object.values(INITIAL_TEAMS)
  .flat()
  .map(t => t.name)
  .sort((a, b) => a.localeCompare(b));

// Resolve the __ALL_TEAMS__ placeholder in BONUS_CONFIG
BONUS_CONFIG.f4[0].options = ALL_TEAM_NAMES;

const DEFAULT_PLAYERS = [
  { id: 'player1', name: 'Commish' },
  { id: 'player2', name: 'Etty'    },
  { id: 'player3', name: 'Colm'    },
  { id: 'player4', name: 'Bergman' },
  { id: 'player5', name: 'Josh'    },
  { id: 'player6', name: 'Michael' },
];

const STORAGE_KEY = 'mmPool2026';
const DEFAULT_PLAYERS_KEY = DEFAULT_PLAYERS.map(p => p.name).join(',');

// ── PLAYER AVATARS ───────────────────────────────────────────
// Map player names to their photo filenames (placed in project root)
const PLAYER_AVATARS = {
  'Josh': 'Josh.jpg',
};

function playerAvatarHtml(playerName, size = 28) {
  const file = PLAYER_AVATARS[playerName];
  if (!file) return '';
  return `<img src="${file}" alt="${esc(playerName)}" class="player-avatar" style="width:${size}px;height:${size}px;">`;
}

// ── STATE ─────────────────────────────────────────────────────

let state = {
  currentView: 'bracket',
  currentRound: 'r64',       // round open for picks
  roundStatus:  'open',      // 'open' | 'locked' | 'closed'
  activePicksRound: 'r64',
  lbRound: 'all',
  resultsRound: 'r64',
  players: [],
  currentPlayer: null,
  results: {},   // gameId → winnerName (string)
  picks: {},     // playerId → { roundId → { gameId → pickedName } }
  pendingPicks: {},
  games: {},
  adminViewPlayer: null,   // playerId admin is peeking at; null = own picks
  sessionPlayer:   null,   // currently logged-in player; null = show login screen
  rulesText:       '',     // pool rules text set by admin
  bonusPicks:   {},   // playerId -> { bonusId -> answer }
  bonusAnswers: {},   // bonusId -> correct answer
  playerPins:   {},   // playerId -> 4-digit PIN string
  liveScores:   {},   // ESPN shortName -> { t1: {name,score}, t2: {name,score}, status, statusDetail }
};

// ── GAME GENERATION ───────────────────────────────────────────

function buildGames() {
  const games = {};

  // R64: 8 games per region
  REGIONS.forEach(region => {
    const teams = INITIAL_TEAMS[region];
    for (let i = 0; i < 8; i++) {
      const id = gameId('r64', region, i);
      games[id] = { id, round: 'r64', region, idx: i,
        t1: teams[i * 2], t2: teams[i * 2 + 1],
        p1: null, p2: null };
    }
  });

  // R32, S16, E8
  const prevMap = { r32: 'r64', s16: 'r32', e8: 's16' };
  const countMap = { r32: 4, s16: 2, e8: 1 };
  ['r32', 's16', 'e8'].forEach(round => {
    const prev = prevMap[round];
    const count = countMap[round];
    REGIONS.forEach(region => {
      for (let i = 0; i < count; i++) {
        const id = gameId(round, region, i);
        games[id] = { id, round, region, idx: i,
          t1: null, t2: null,
          p1: gameId(prev, region, i * 2),
          p2: gameId(prev, region, i * 2 + 1) };
      }
    });
  });

  // Final Four: 2 games
  F4_PAIRINGS.forEach(([r1, r2], i) => {
    const id = gameId('f4', null, i);
    games[id] = { id, round: 'f4', region: null, idx: i,
      t1: null, t2: null,
      p1: gameId('e8', r1, 0), p2: gameId('e8', r2, 0),
      label: `${r1} vs ${r2}` };
  });

  // Championship
  const cid = gameId('champ', null, 0);
  games[cid] = { id: cid, round: 'champ', region: null, idx: 0,
    t1: null, t2: null,
    p1: gameId('f4', null, 0), p2: gameId('f4', null, 1),
    label: 'National Championship' };

  return games;
}

function gameId(round, region, idx) {
  return region ? `${round}-${region.toLowerCase()}-${idx}` : `${round}-${idx}`;
}

// Resolve the team playing in slot 1 or 2 of a game
function resolveTeam(game, slot) {
  if (game.round === 'r64') return slot === 1 ? game.t1 : game.t2;
  const parentId = slot === 1 ? game.p1 : game.p2;
  if (!parentId) return null;
  return getWinner(parentId);
}

function getTeams(game) {
  return { t1: resolveTeam(game, 1), t2: resolveTeam(game, 2) };
}

function getWinner(gid) {
  const name = state.results[gid];
  if (!name) return null;
  const game = state.games[gid];
  if (!game) return null;
  const { t1, t2 } = getTeams(game);
  if (t1 && t1.name === name) return t1;
  if (t2 && t2.name === name) return t2;
  return null;
}

function getGamesForRound(roundId) {
  return Object.values(state.games).filter(g => g.round === roundId);
}

// ── SCORING ───────────────────────────────────────────────────

// Returns how many pts picking `pickedName` in `game` is worth.
// Favorites (lower seed number) earn flat cfg.pts.
// Underdogs earn an upset bonus: ((dogSeed - favSeed) + cfg.pts) * cfg.multiplier.
function calcPickPoints(game, pickedName, cfg) {
  const { t1, t2 } = getTeams(game);
  if (!t1 || !t2) return cfg.pts;               // TBD matchup — fall back to base
  const fav = t1.seed <= t2.seed ? t1 : t2;     // lower seed number = favourite
  const dog = fav === t1 ? t2 : t1;
  if (dog.seed === fav.seed) return cfg.pts;     // equal seeds — no upset bonus
  if (pickedName === dog.name) {
    return Math.round(((dog.seed - fav.seed) + cfg.pts) * cfg.multiplier * 10) / 10;
  }
  return cfg.pts;
}

// Format a score for display: 0 (or falsy) → '-', integers as-is, decimals to 1 place.
function fmtScore(n) {
  if (!n) return '-';
  const r = Math.round(n * 10) / 10;
  return r === Math.floor(r) ? String(Math.floor(r)) : r.toFixed(1);
}

function getPlayerRoundScore(playerId, roundId) {
  const roundPicks = (state.picks[playerId] || {})[roundId] || {};
  const cfg = ROUND_CONFIG.find(r => r.id === roundId);
  let score = 0, possible = 0, correct = 0, wrong = 0;
  getGamesForRound(roundId).forEach(game => {
    const pickedName = roundPicks[game.id];
    // Use the raw result name directly — getWinner() can return null if a parent
    // round's results are missing, which would misclassify wrong picks as "possible".
    const resultName = state.results[game.id];
    if (pickedName) {
      if (resultName !== undefined) {
        // A result has been recorded for this game — compare pick directly
        if (resultName === pickedName) { score += calcPickPoints(game, pickedName, cfg); correct++; }
        else wrong++;
      } else {
        // No result yet — count as possible if the team is still alive
        if (isPickStillAlive(pickedName, roundId, game)) possible += calcPickPoints(game, pickedName, cfg);
      }
    }
  });
  const bonusPts = getBonusScore(playerId, roundId);
  score += bonusPts;
  return { score, possible, correct, wrong, bonusPts };
}

function isPickStillAlive(teamName, roundId, game) {
  // Simple heuristic: if the picked team hasn't lost yet in any resolved game, it's alive
  // Check each resolved game — if teamName lost, return false
  for (const gid of Object.keys(state.results)) {
    const g = state.games[gid];
    if (!g) continue;
    const winner = getWinner(gid);
    if (!winner) continue;
    const { t1, t2 } = getTeams(g);
    const loser = winner.name === (t1 && t1.name) ? t2 : t1;
    if (loser && loser.name === teamName) return false;
  }
  return true;
}

function getPlayerTotalScore(playerId) {
  let total = 0, possible = 0, correct = 0, wrong = 0, totalBonus = 0;
  ROUND_CONFIG.forEach(cfg => {
    const r = getPlayerRoundScore(playerId, cfg.id);
    total    += r.score;
    possible += r.possible;
    correct  += r.correct;
    wrong    += r.wrong;
    totalBonus += (r.bonusPts || 0);
  });
  return { total, possible, correct, wrong, totalBonus };
}

// ── BONUS SCORING ─────────────────────────────────────────────

function getBonusScore(playerId, roundId) {
  const bonuses = BONUS_CONFIG[roundId] || [];
  let score = 0;
  bonuses.forEach(b => {
    const playerAns = (state.bonusPicks[playerId] || {})[b.id];
    const correctAns = state.bonusAnswers[b.id];
    if (!playerAns || !correctAns) return;
    if (b.type === 'multi') {
      if (!Array.isArray(playerAns) || !Array.isArray(correctAns)) return;
      const normP = playerAns.map(s => s.trim().toLowerCase()).filter(Boolean).sort();
      const normC = correctAns.map(s => s.trim().toLowerCase()).filter(Boolean).sort();
      if (normP.length === normC.length && normP.every((v, i) => v === normC[i])) {
        score += b.points;
      }
    } else {
      if (playerAns.trim().toLowerCase() === correctAns.trim().toLowerCase()) {
        score += b.points;
      }
    }
  });
  return score;
}

function getPlayerBonusDetails(playerId, roundId) {
  const bonuses = BONUS_CONFIG[roundId] || [];
  return bonuses.map(b => {
    const playerAns = (state.bonusPicks[playerId] || {})[b.id];
    const correctAns = state.bonusAnswers[b.id];
    let status = 'pending';
    let earned = 0;
    if (playerAns && correctAns) {
      let isCorrect = false;
      if (b.type === 'multi') {
        if (Array.isArray(playerAns) && Array.isArray(correctAns)) {
          const np = playerAns.map(s => s.trim().toLowerCase()).filter(Boolean).sort();
          const nc = correctAns.map(s => s.trim().toLowerCase()).filter(Boolean).sort();
          isCorrect = np.length === nc.length && np.every((v, i) => v === nc[i]);
        }
      } else {
        isCorrect = playerAns.trim().toLowerCase() === correctAns.trim().toLowerCase();
      }
      status = isCorrect ? 'correct' : 'wrong';
      earned = isCorrect ? b.points : 0;
    }
    return { ...b, playerAns, correctAns, status, earned };
  });
}

// ── PERSISTENCE ───────────────────────────────────────────────

async function saveState() {
  const sender = state.sessionPlayer || state.currentPlayer;
  const admin = isAdmin();

  let payload;
  if (admin || !sender) {
    // Admin sends everything — server accepts all fields from admin
    payload = {
      currentRound: state.currentRound,
      roundStatus: state.roundStatus,
      players: state.players,
      results: state.results,
      picks: state.picks,
      rulesText: state.rulesText,
      defaultPlayersKey: DEFAULT_PLAYERS_KEY,
      bonusPicks: state.bonusPicks,
      bonusAnswers: state.bonusAnswers,
      playerPins: state.playerPins,
      _sender: sender,
    };
  } else {
    // Non-admin only sends own picks for the active round — prevents stale round data
    const activeRound = state.activePicksRound || state.currentRound;
    const roundPicks = (state.picks[sender] || {})[activeRound] || {};
    payload = {
      picks: { [sender]: { [activeRound]: roundPicks } },
      bonusPicks: { [sender]: state.bonusPicks[sender] || {} },
      _sender: sender,
    };
  }

  // Save to server with confirmation
  try {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn('Save failed:', err);
    showToast('Save failed — try again', 'error');
    // Cache in localStorage as offline fallback
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload, _offlineSave: true }));
    } catch (e) { /* ignore */ }
    throw err; // re-throw so callers know it failed
  }

  // Also cache in localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) { /* ignore */ }
}

async function loadState() {
  // Try server first
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const saved = await res.json();
      if (saved && Object.keys(saved).length > 0) {
        applyLoadedState(saved);
        return;
      }
    }
  } catch (e) {
    console.warn('Server fetch failed, falling back to localStorage:', e);
  }
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    applyLoadedState(saved);
  } catch (e) { /* ignore */ }
}

function applyLoadedState(saved) {
  // Always load all server data — picks, players, PINs are managed on the server
  if (saved.players?.length)  state.players  = saved.players;
  if (saved.results)          state.results  = saved.results;
  if (saved.picks)            state.picks    = saved.picks;
  if (saved.currentRound)     state.currentRound  = saved.currentRound;
  if (saved.roundStatus)      state.roundStatus   = saved.roundStatus;
  if (saved.rulesText !== undefined) state.rulesText = saved.rulesText;
  if (saved.bonusPicks)   state.bonusPicks   = saved.bonusPicks;
  if (saved.bonusAnswers) state.bonusAnswers = saved.bonusAnswers;
  // PINs: server sends full PINs only to admin, pinFlags to everyone
  if (saved.playerPins)      state.playerPins      = saved.playerPins;
}

// ── TOAST ─────────────────────────────────────────────────────

let toastTimer;
function showToast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'toast'; }, 2800);
}

// ── VIEW SWITCHING ────────────────────────────────────────────

function switchView(view) {
  // Warn if leaving picks view with unsaved changes
  if (state.currentView === 'picks' && view !== 'picks' && Object.keys(state.pendingPicks || {}).length > 0) {
    if (!confirm('You have unsaved picks. Leave without saving?')) return;
    state.pendingPicks = {};
  }
  state.currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.querySelector(`[data-view="${view}"]`).classList.add('active');
  renderCurrentView();
}

function renderCurrentView() {
  updateRoundStatus();
  updatePlayerSelect();
  updateSessionHeader();
  switch (state.currentView) {
    case 'rules':       renderRules();        break;
    case 'bracket':     renderBracket();      break;
    case 'picks':       renderPicks();        break;
    case 'leaderboard': renderLeaderboard();  break;
    case 'admin':       renderAdmin();        break;
  }
}

// ── SESSION / LOGIN ───────────────────────────────────────────

// The first player in the list is always the admin (Commish).
function isAdmin() {
  return !!(state.sessionPlayer && state.sessionPlayer === state.players[0]?.id);
}

// Returns true if other players' picks for `roundId` should be visible.
// Past rounds: always visible.
// Current round: only once admin marks it 'closed'.
// Future rounds: never visible (to non-admins).
// Admin always sees everything.
function isRoundPicksVisible(roundId) {
  if (isAdmin()) return true;
  const ri = ROUND_CONFIG.findIndex(r => r.id === roundId);
  const ci = ROUND_CONFIG.findIndex(r => r.id === state.currentRound);
  if (ri < ci) return true;                              // past round — always open
  if (ri === ci) return state.roundStatus === 'closed';  // current round — only when closed
  return false;                                          // future round — never
}

function renderLoginOverlay() {
  const overlay = document.getElementById('login-overlay');
  const grid    = document.getElementById('login-players-grid');
  grid.innerHTML = '';

  // Hide PIN modal if visible
  const pinModal = document.getElementById('pin-modal');
  if (pinModal) pinModal.style.display = 'none';

  state.players.forEach((p, i) => {
    const { total } = getPlayerTotalScore(p.id);
    const adminPlayer = (i === 0);
    const hasPin = !!(state.playerPins?.[p.id]);
    const btn = document.createElement('button');
    btn.className = 'login-player-btn' + (adminPlayer ? ' admin-player' : '');
    btn.innerHTML = `
      ${adminPlayer ? '<span class="lp-badge">&#128081; Admin</span>' : ''}
      <span class="lp-name">${esc(p.name)}</span>
      <span class="lp-score">${total > 0 ? fmtScore(total) + ' pts' : 'No picks yet'}</span>
      ${hasPin ? '<span class="lp-lock">&#128274;</span>' : ''}`;
    btn.addEventListener('click', () => {
      if (hasPin) {
        showPinModal(p.id, p.name);
      } else {
        loginAs(p.id);
      }
    });
    grid.appendChild(btn);
  });

  overlay.style.display = 'flex';
}

function showPinModal(playerId, playerName) {
  const modal = document.getElementById('pin-modal');
  const nameEl = document.getElementById('pin-player-name');
  const input  = document.getElementById('pin-input');
  const errEl  = document.getElementById('pin-error');

  nameEl.textContent = playerName;
  input.value = '';
  errEl.style.display = 'none';
  modal.style.display = 'flex';
  modal.dataset.playerId = playerId;
  setTimeout(() => input.focus(), 50);
}

async function submitPin() {
  const modal = document.getElementById('pin-modal');
  const input = document.getElementById('pin-input');
  const errEl = document.getElementById('pin-error');
  const submitBtn = document.getElementById('pin-submit-btn');
  const playerId = modal.dataset.playerId;
  const entered = input.value.trim();

  // Disable button during validation
  if (submitBtn) submitBtn.disabled = true;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, pin: entered }),
    });
    const data = await res.json();
    if (data.ok) {
      modal.style.display = 'none';
      loginAs(playerId);
    } else {
      errEl.style.display = 'block';
      input.value = '';
      input.focus();
    }
  } catch (e) {
    // Network error — fall back to client-side check if admin has PINs loaded
    const correct = state.playerPins?.[playerId];
    if (correct && entered === correct) {
      modal.style.display = 'none';
      loginAs(playerId);
    } else if (!correct) {
      // Can't validate — let them in (no PIN data available)
      modal.style.display = 'none';
      loginAs(playerId);
    } else {
      errEl.style.display = 'block';
      input.value = '';
      input.focus();
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function closePinModal() {
  document.getElementById('pin-modal').style.display = 'none';
}

function loginAs(pid) {
  state.sessionPlayer   = pid;
  state.currentPlayer   = pid;
  state.adminViewPlayer = null;
  sessionStorage.setItem('mm_session', pid);
  document.getElementById('login-overlay').style.display = 'none';
  updateSessionHeader();
  updatePlayerSelect();
  switchView('bracket');
}

function logoutSession() {
  state.sessionPlayer   = null;
  state.adminViewPlayer = null;
  sessionStorage.removeItem('mm_session');
  renderLoginOverlay();
}

function updateSessionHeader() {
  const adminBtn        = document.getElementById('admin-nav-btn');
  const sessionEl       = document.getElementById('session-indicator');
  const sessionNameEl   = document.getElementById('session-name');
  const playerWrapEl    = document.getElementById('player-wrap');

  if (!state.sessionPlayer) return;

  const admin = isAdmin();

  // Admin nav button — only visible to Commish
  if (adminBtn) adminBtn.style.display = admin ? '' : 'none';

  // Player dropdown — only visible to Commish
  if (playerWrapEl) playerWrapEl.style.display = admin ? '' : 'none';

  // Session badge — shown for regular players
  if (sessionEl) sessionEl.style.display = admin ? 'none' : 'flex';
  if (sessionNameEl) {
    const player = state.players.find(p => p.id === state.sessionPlayer);
    sessionNameEl.textContent = player?.name || '';
  }
}

// ── HEADER HELPERS ────────────────────────────────────────────

function updateRoundStatus() {
  const pill = document.getElementById('round-status');
  const cfg = ROUND_CONFIG.find(r => r.id === state.currentRound);
  const labels = { open: 'Open', locked: 'Locked', closed: 'Closed' };
  pill.textContent = `${cfg?.label ?? ''} — ${labels[state.roundStatus] ?? ''}`;
  pill.className = `status-pill ${state.roundStatus}`;
}

function updatePlayerSelect() {
  // Non-admin players: fix currentPlayer = sessionPlayer, no dropdown needed
  if (state.sessionPlayer && !isAdmin()) {
    state.currentPlayer = state.sessionPlayer;
    return;
  }
  const sel = document.getElementById('player-select');
  const cur = sel.value || state.currentPlayer;
  sel.innerHTML = '';
  state.players.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    if (p.id === cur) opt.selected = true;
    sel.appendChild(opt);
  });
  if (!state.players.find(p => p.id === cur) && state.players.length) {
    state.currentPlayer = state.players[0].id;
    sel.value = state.currentPlayer;
  } else {
    state.currentPlayer = sel.value;
  }
}

// ── BRACKET RENDERING ─────────────────────────────────────────

// CBS-style header text and dates for each round
const ROUND_LABELS = {
  r64:   'ROUND OF 64',
  r32:   'ROUND OF 32',
  s16:   'SWEET 16',
  e8:    'ELITE EIGHT',
  f4:    'FINAL FOUR',
  champ: 'CHAMPIONSHIP',
};
const ROUND_DATES = {
  r64:   'Mar 20-21',
  r32:   'Mar 22-23',
  s16:   'Mar 27-28',
  e8:    'Mar 29-30',
  f4:    'Apr 5',
  champ: 'Apr 7',
};

function renderBracket() {
  const wrapper = document.getElementById('bracket-wrapper');
  wrapper.innerHTML = '';

  // Left column: West (top) + East (bottom), rounds L→R
  const leftCol = document.createElement('div');
  leftCol.className = 'bracket-left-col';
  leftCol.appendChild(buildRegionBlock('West', 'left', true));
  leftCol.appendChild(buildRegionBlock('East', 'left', false));

  // Center column: F4 top → Championship → F4 bottom
  const centerCol = buildBracketCenter();

  // Right column: South (top) + Midwest (bottom), rounds R→L
  const rightCol = document.createElement('div');
  rightCol.className = 'bracket-right-col';
  rightCol.appendChild(buildRegionBlock('South', 'right', true));
  rightCol.appendChild(buildRegionBlock('Midwest', 'right', false));

  wrapper.appendChild(leftCol);
  wrapper.appendChild(centerCol);
  wrapper.appendChild(rightCol);
}

function buildRegionBlock(region, side, showHeader = true) {
  const rounds = ['r64','r32','s16','e8'];
  const orderedRounds = side === 'right' ? [...rounds].reverse() : rounds;

  const block = document.createElement('div');
  block.className = 'region-block';

  // Header row for this region's round columns (only for top regions in each column)
  if (showHeader) {
    const hdrRow = document.createElement('div');
    hdrRow.className = 'bracket-hdr-row';
    orderedRounds.forEach(roundId => {
      const cell = document.createElement('div');
      cell.className = 'bracket-hdr-cell';
      cell.innerHTML = `<strong>${ROUND_LABELS[roundId]}</strong>`;
      hdrRow.appendChild(cell);
    });
    block.appendChild(hdrRow);
  }

  const lbl = document.createElement('div');
  lbl.className = 'region-label';
  lbl.textContent = `${region} Region`;
  block.appendChild(lbl);

  const roundsRow = document.createElement('div');
  roundsRow.className = 'region-rounds';
  orderedRounds.forEach(roundId => {
    roundsRow.appendChild(buildRoundCol(region, roundId));
  });
  block.appendChild(roundsRow);

  return block;
}

function buildRoundCol(region, roundId) {
  const col = document.createElement('div');
  col.className = `round-col round-${roundId}`;

  const games = Object.values(state.games).filter(
    g => g.round === roundId && g.region === region
  ).sort((a, b) => a.idx - b.idx);

  games.forEach(game => {
    const wrap = document.createElement('div');
    wrap.className = 'matchup-wrap';
    wrap.appendChild(buildMatchup(game));
    col.appendChild(wrap);

    // R64: insert a 26px gap after the first game of each pair (indices 0,2,4,6)
    // so each pair = 52px game + 26px gap + 52px game = 130px, 4 pairs = 520px
    if (roundId === 'r64' && game.idx % 2 === 0) {
      const gap = document.createElement('div');
      gap.className = 'r64-pair-gap';
      col.appendChild(gap);
    }
  });

  return col;
}

// Find live score for a game by matching team names against ESPN data
function findGameScore(t1, t2) {
  if (!t1 || !t2 || !state.liveScores) return null;
  const name1 = t1.name.toLowerCase();
  const name2 = t2.name.toLowerCase();

  for (const [key, sc] of Object.entries(state.liveScores)) {
    const sn1 = sc.t1.name.toLowerCase();
    const sn2 = sc.t2.name.toLowerCase();
    // Match if both team names appear (ESPN may abbreviate differently)
    if ((sn1.includes(name1) || name1.includes(sn1) || sn1 === name1) &&
        (sn2.includes(name2) || name2.includes(sn2) || sn2 === name2)) {
      return sc;
    }
    // Try reversed order
    if ((sn1.includes(name2) || name2.includes(sn1) || sn1 === name2) &&
        (sn2.includes(name1) || name1.includes(sn2) || sn2 === name1)) {
      return { t1: sc.t2, t2: sc.t1, status: sc.status, statusDetail: sc.statusDetail, clock: sc.clock, period: sc.period };
    }
  }
  return null;
}

function buildMatchup(game) {
  const { t1, t2 } = getTeams(game);
  const winner = getWinner(game.id);
  const playerPick = (state.picks[state.currentPlayer] || {})[game.round]?.[game.id];
  const liveScore = findGameScore(t1, t2);

  const card = document.createElement('div');
  card.className = 'matchup';

  [{ team: t1, slot: 1 }, { team: t2, slot: 2 }].forEach(({ team, slot }) => {
    const row = document.createElement('div');
    row.className = 'team-slot';

    if (!team) {
      row.classList.add('tbd');
      row.innerHTML = `<span class="t-seed"></span><span class="t-name">TBD</span>`;
    } else {
      const isWinner = winner && winner.name === team.name;
      const isLoser  = winner && winner.name !== team.name;
      if (isWinner) row.classList.add('winner');
      if (isLoser)  row.classList.add('loser');
      const pickedThis = playerPick === team.name;
      if (pickedThis && isWinner) row.classList.add('pick-correct');
      if (pickedThis && isLoser)  row.classList.add('pick-wrong');

      // Find score for this team from ESPN data
      let scoreHtml = '';
      if (liveScore) {
        const teamScore = (slot === 1) ? liveScore.t1 : liveScore.t2;
        const scoreClass = liveScore.status === 'post' ? 'score-final' : 'score-live';
        scoreHtml = `<span class="t-score ${scoreClass}">${teamScore.score}</span>`;
      }

      row.innerHTML = `
        <span class="t-seed">${team.seed}</span>
        <span class="t-name">${esc(team.name)}</span>
        ${scoreHtml}`;
    }
    card.appendChild(row);
  });

  // Show game status (live indicator)
  if (liveScore && liveScore.status === 'in') {
    const liveTag = document.createElement('div');
    liveTag.className = 'game-live-tag';
    liveTag.textContent = liveScore.statusDetail || 'LIVE';
    card.appendChild(liveTag);
  }

  return card;
}

function buildBracketCenter() {
  const center = document.createElement('div');
  center.className = 'bracket-center';

  // Build an F4 column showing a single game (gameIndex 0 or 1)
  function buildF4Col(gameIndex) {
    const col = document.createElement('div');
    col.className = 'f4-col';

    // Header cell — aligns with round label headers on left/right columns
    const hdrCell = document.createElement('div');
    hdrCell.className = 'bracket-hdr-cell';
    hdrCell.innerHTML = '<strong>Final Four</strong>';
    col.appendChild(hdrCell);

    const wrap = document.createElement('div');
    wrap.className = 'f4-game-wrap';

    const lbl = document.createElement('div');
    lbl.className = 'f4-label';
    lbl.textContent = F4_PAIRINGS[gameIndex].join(' · ');
    wrap.appendChild(lbl);

    const game = state.games[gameId('f4', null, gameIndex)];
    if (game) {
      const w = document.createElement('div');
      w.className = 'matchup-wrap';
      w.appendChild(buildMatchup(game));
      wrap.appendChild(w);
    }

    col.appendChild(wrap);
    return col;
  }

  // ── Left F4 column (game 0: West vs East) ──
  center.appendChild(buildF4Col(0));

  // ── Championship column ──
  const champCol = document.createElement('div');
  champCol.className = 'champ-col';

  // Header cell — aligns with round label headers
  const champHdrCell = document.createElement('div');
  champHdrCell.className = 'bracket-hdr-cell';
  champHdrCell.innerHTML = '<strong>Championship</strong>';
  champCol.appendChild(champHdrCell);

  // Content wrapper — centers the game vertically in the remaining space
  const champContent = document.createElement('div');
  champContent.className = 'champ-content';

  const champInfo = document.createElement('div');
  champInfo.className = 'champ-info';
  champInfo.innerHTML = `
    <div class="champ-title">National Championship</div>
    <div class="champ-venue">Indianapolis, IN</div>
    <div class="champ-date">Monday, April 6, 2026</div>
  `;
  champContent.appendChild(champInfo);

  const champGame = state.games[gameId('champ', null, 0)];
  if (champGame) {
    const champWrap = document.createElement('div');
    champWrap.className = 'matchup-wrap';
    champWrap.appendChild(buildMatchup(champGame));
    champContent.appendChild(champWrap);
  }

  // Winner box (always visible, golden border)
  const winnerBox = document.createElement('div');
  winnerBox.className = 'winner-box';
  const champWinner = getWinner(gameId('champ', null, 0));
  winnerBox.innerHTML = champWinner
    ? `<div class="wb-label">&#127942; Champion</div><div class="wb-team">${esc(champWinner.name)}</div>`
    : `<div class="wb-label">&#127942; Champion</div><div class="wb-team wb-tbd">TBD</div>`;
  champContent.appendChild(winnerBox);

  champCol.appendChild(champContent);
  center.appendChild(champCol);

  // ── Right F4 column (game 1: South vs Midwest) ──
  center.appendChild(buildF4Col(1));

  return center;
}

// ── RULES RENDERING ───────────────────────────────────────────

const DEFAULT_RULES_PLACEHOLDER = `MARCH MADNESS PICK-BY-ROUND POOL — OFFICIAL RULES

HOW IT WORKS
Before each round begins, every player picks the winner of each game in that round. Once the round is locked by the Commissioner, picks cannot be changed. A new round opens after all games in the current round are complete.

SCORING — GAME PICKS
Round of 64: 1 point per correct pick (x1.0 multiplier)
Round of 32: 2 points per correct pick (x1.2 multiplier)
Sweet 16: 4 points per correct pick (x1.4 multiplier)
Elite 8: 6 points per correct pick (x1.6 multiplier)
Final Four: 8 points per correct pick (x1.8 multiplier)
Championship: 12 points per correct pick (x2.0 multiplier)

Upset bonus: When a lower-seeded team wins, your pick earns bonus points based on the seed difference multiplied by the round multiplier.

BONUS QUESTIONS
Each round includes a bonus opportunity worth extra points:

Round of 64 — Most Successful Conference (4 pts)
Round of 32 — Correct Number of Buzzer Beaters (6 pts)
Sweet 16 — Highest Point Differential (8 pts)
Elite 8 — High Scorer / Player Name (10 pts) + Name the Four Elite 8 Winners (25 pts)
Final Four — Team with Most 3-Pointers (6 pts) + Number of 3-Pointers Made (6 pts)

GENERAL RULES
1. All picks must be submitted before the round is locked by the Commissioner.
2. Once a round is closed, picks are final — no changes allowed.
3. The Commissioner enters official results and correct bonus answers, which automatically update all scores.
4. The player with the most total points at the end of the tournament wins.
5. In case of a tie, the player with more correct Championship/Final Four picks wins.

Good luck and have fun!`;

function renderRules() {
  const body        = document.getElementById('rules-body');
  const editControls = document.getElementById('rules-edit-controls');
  const admin       = isAdmin();
  body.innerHTML    = '';

  // Show/hide the Save button (admin only)
  if (editControls) editControls.style.display = admin ? 'block' : 'none';

  if (admin) {
    // Admin: editable textarea
    const hint = document.createElement('p');
    hint.className = 'rules-hint';
    hint.textContent = 'Write your pool rules below. Plain text — use blank lines to separate sections.';
    body.appendChild(hint);

    const ta = document.createElement('textarea');
    ta.id          = 'rules-textarea';
    ta.className   = 'rules-textarea';
    ta.placeholder = DEFAULT_RULES_PLACEHOLDER;
    ta.value       = state.rulesText;
    body.appendChild(ta);
  } else {
    // Regular player: read-only formatted display
    const text = state.rulesText.trim() || DEFAULT_RULES_PLACEHOLDER;
    const display = document.createElement('div');
    display.className = 'rules-display';

    // Render each paragraph (blank-line separated) as a <p>
    text.split(/\n{2,}/).forEach(para => {
      const p = document.createElement('p');
      // Preserve single line breaks within a paragraph
      p.innerHTML = esc(para.trim()).replace(/\n/g, '<br>');
      display.appendChild(p);
    });

    body.appendChild(display);
  }
}

function saveRules() {
  if (!isAdmin()) return;   // only Commish can save rules
  const ta = document.getElementById('rules-textarea');
  if (!ta) return;
  state.rulesText = ta.value;
  saveState();
  showToast('Rules saved!', 'success');
}

// ── PICKS RENDERING ───────────────────────────────────────────

function renderPicks() {
  renderPicksTabs();
  renderPicksBody();
}

function renderPicksTabs() {
  const tabs = document.getElementById('picks-tabs');
  tabs.innerHTML = '';
  ROUND_CONFIG.forEach(cfg => {
    const btn = document.createElement('button');
    btn.className = 'round-tab';
    btn.textContent = cfg.short;
    if (cfg.id === state.activePicksRound) btn.classList.add('active');

    // Classify tab
    const ri = ROUND_CONFIG.findIndex(r => r.id === cfg.id);
    const ci = ROUND_CONFIG.findIndex(r => r.id === state.currentRound);
    if (ri < ci) btn.classList.add('done');
    else if (ri === ci && state.roundStatus === 'locked')  btn.classList.add('locked');
    else if (ri > ci) btn.classList.add('future');

    btn.addEventListener('click', () => {
      // Warn if switching rounds with unsaved picks
      const pending = Object.keys(state.pendingPicks || {}).filter(k => k.startsWith(state.activePicksRound + '-'));
      const saved = (state.picks[state.currentPlayer] || {})[state.activePicksRound] || {};
      const hasUnsaved = pending.some(k => state.pendingPicks[k] !== saved[k]);
      if (hasUnsaved && !confirm('You have unsaved picks. Switch round without saving?')) return;
      state.pendingPicks = {};
      state.pendingPicksRound = cfg.id;
      state.activePicksRound = cfg.id;
      renderPicks();
    });
    tabs.appendChild(btn);
  });
}

function renderPicksBody() {
  const body   = document.getElementById('picks-body');
  const saveBar = document.getElementById('save-bar');
  body.innerHTML = '';

  const roundId = state.activePicksRound;
  const cfg = ROUND_CONFIG.find(r => r.id === roundId);
  const ri  = ROUND_CONFIG.findIndex(r => r.id === roundId);
  const ci  = ROUND_CONFIG.findIndex(r => r.id === state.currentRound);

  const isCurrentRound = roundId === state.currentRound;
  const isPast         = ri < ci;
  const isFuture       = ri > ci;

  // Admin peek: viewing another player's picks — always read-only
  const viewId   = state.adminViewPlayer || state.currentPlayer;
  const isAdminView = !!state.adminViewPlayer;
  const isOpen   = !isAdminView && isCurrentRound && state.roundStatus === 'open';
  const isLocked = !isAdminView && isCurrentRound && state.roundStatus === 'locked';

  const savedPicks = (state.picks[viewId] || {})[roundId] || {};
  // Preserve unsaved picks only if same round, same player, and during poll refresh
  const hasPending = Object.keys(state.pendingPicks || {}).length > 0;
  const sameRound = state.pendingPicksRound === roundId;
  const samePlayer = state.pendingPicksPlayer === viewId;
  if (isAdminView) {
    state.pendingPicks = {};
  } else if (hasPending && sameRound && samePlayer) {
    // Keep existing pending picks (poll refresh case)
  } else {
    state.pendingPicks = { ...savedPicks };
    state.pendingPicksRound = roundId;
    state.pendingPicksPlayer = viewId;
  }

  // Admin peek banner
  if (isAdminView) {
    const viewName = state.players.find(p => p.id === viewId)?.name || 'Player';
    const banner = document.createElement('div');
    banner.className = 'admin-view-banner';
    banner.innerHTML = `<span>&#128065; Viewing <strong>${esc(viewName)}</strong>'s picks</span>
      <button class="admin-view-close">&#10005; Back to my picks</button>`;
    banner.querySelector('.admin-view-close').addEventListener('click', () => {
      state.adminViewPlayer = null;
      renderPicks();
    });
    body.appendChild(banner);

    // Non-admin trying to view a round whose picks aren't revealed yet — block it
    if (!isAdmin() && !isRoundPicksVisible(roundId)) {
      const lockDiv = document.createElement('div');
      lockDiv.className = 'picks-hidden-msg';
      lockDiv.innerHTML = `&#128274; <strong>${esc(viewName)}</strong>'s picks for this round are hidden until the Admin closes it.`;
      body.appendChild(lockDiv);
      saveBar.style.display = 'none';
      return;
    }
  }

  // Status message
  const msg = document.createElement('div');
  if (isAdminView) {
    const viewName = state.players.find(p => p.id === viewId)?.name || 'Player';
    msg.className = 'picks-locked-msg';
    if (isPast)        msg.textContent = `Round complete — showing ${viewName}'s results for ${cfg.label}.`;
    else if (isFuture) msg.textContent = `${cfg.label} picks not yet open.`;
    else               msg.textContent = `Showing ${viewName}'s ${cfg.label} picks (read-only).`;
  } else if (isOpen) {
    msg.className = 'picks-open-msg';
    msg.textContent = `✔ ${cfg.label} is open — select your winners below (${cfg.pts} pt${cfg.pts > 1 ? 's' : ''} per correct pick).`;
  } else if (isLocked) {
    msg.className = 'picks-locked-msg';
    msg.textContent = `⚠ Picks are locked while ${cfg.label} games are in progress.`;
  } else if (isPast) {
    msg.className = 'picks-locked-msg';
    msg.textContent = `This round is complete. Showing your results for ${cfg.label}.`;
  } else if (isFuture) {
    msg.className = 'picks-locked-msg';
    msg.textContent = `${cfg.label} picks open after the current round concludes.`;
  }
  body.appendChild(msg);

  // Game grid
  const grid = document.createElement('div');
  grid.className = 'picks-grid';

  const games = getGamesForRound(roundId);
  games.forEach(game => {
    const { t1, t2 } = getTeams(game);
    const winner = getWinner(game.id);
    const card = buildPickCard(game, t1, t2, winner, isOpen, savedPicks, cfg);
    grid.appendChild(card);
  });

  body.appendChild(grid);

  // ── BONUS SECTION ──────────────────────────────────────────
  const bonuses = BONUS_CONFIG[roundId] || [];
  if (bonuses.length > 0) {
    const bonusSection = document.createElement('div');
    bonusSection.className = 'bonus-section';
    const bonusTitle = document.createElement('h3');
    bonusTitle.className = 'bonus-title';
    bonusTitle.innerHTML = '&#127775; Bonus Opportunity';
    bonusSection.appendChild(bonusTitle);

    bonuses.forEach(b => {
      const bonusCard = document.createElement('div');
      bonusCard.className = 'bonus-card';

      const hdr = document.createElement('div');
      hdr.className = 'bonus-card-hdr';
      hdr.innerHTML = `<span class="bonus-label">${esc(b.label)}</span><span class="bonus-pts">${b.points} pts</span>`;
      bonusCard.appendChild(hdr);

      const playerAns = (state.bonusPicks[viewId] || {})[b.id];
      const detail = getPlayerBonusDetails(viewId, roundId).find(d => d.id === b.id);

      if (b.type === 'multi') {
        // Auto-populate from player's E8 picks
        const e8Games = getGamesForRound('e8');
        const e8Picks = (state.picks[viewId] || {})['e8'] || {};
        const autoTeams = e8Games.map(g => e8Picks[g.id] || '');
        // Persist into bonusPicks so scoring works
        if (!state.bonusPicks[viewId]) state.bonusPicks[viewId] = {};
        state.bonusPicks[viewId][b.id] = autoTeams;

        for (let i = 0; i < autoTeams.length; i++) {
          const row = document.createElement('div');
          row.className = 'bonus-input-row';
          const label = document.createElement('span');
          label.className = 'bonus-input-label';
          label.textContent = `Team ${i + 1}:`;
          row.appendChild(label);
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'bonus-input';
          inp.placeholder = 'Picked from your E8 selections';
          inp.value = autoTeams[i] || '';
          inp.disabled = true;   // always read-only — driven by E8 picks
          inp.dataset.bonusId = b.id;
          inp.dataset.bonusIdx = i;
          row.appendChild(inp);
          bonusCard.appendChild(row);
        }
      } else if (b.type === 'select' && b.options) {
        const row = document.createElement('div');
        row.className = 'bonus-input-row';
        const sel = document.createElement('select');
        sel.className = 'bonus-input';
        sel.disabled = !isOpen;
        sel.dataset.bonusId = b.id;
        const defOpt = document.createElement('option');
        defOpt.value = '';
        defOpt.textContent = '— Select —';
        sel.appendChild(defOpt);
        b.options.forEach(optText => {
          const o = document.createElement('option');
          o.value = optText;
          o.textContent = optText;
          if (playerAns === optText) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener('change', () => {
          if (!state.bonusPicks[state.currentPlayer]) state.bonusPicks[state.currentPlayer] = {};
          state.bonusPicks[state.currentPlayer][b.id] = sel.value;
        });
        row.appendChild(sel);
        bonusCard.appendChild(row);
      } else {
        const row = document.createElement('div');
        row.className = 'bonus-input-row';
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'bonus-input';
        inp.placeholder = 'Enter your answer...';
        inp.value = playerAns || '';
        inp.disabled = !isOpen;
        inp.dataset.bonusId = b.id;
        inp.addEventListener('change', () => {
          if (!state.bonusPicks[state.currentPlayer]) state.bonusPicks[state.currentPlayer] = {};
          state.bonusPicks[state.currentPlayer][b.id] = inp.value.trim();
        });
        row.appendChild(inp);
        bonusCard.appendChild(row);
      }

      // Show result if admin entered correct answer
      if (detail && detail.status !== 'pending') {
        const res = document.createElement('div');
        res.className = 'bonus-result ' + detail.status;
        if (detail.status === 'correct') {
          res.innerHTML = `&#10004; Correct! +${detail.earned} pts`;
        } else {
          const correctDisplay = Array.isArray(detail.correctAns)
            ? detail.correctAns.join(', ') : detail.correctAns;
          res.innerHTML = `&#10008; Incorrect &mdash; Answer: ${esc(correctDisplay)}`;
        }
        bonusCard.appendChild(res);
      }

      bonusSection.appendChild(bonusCard);
    });

    body.appendChild(bonusSection);
  }

  // Save bar
  if (isOpen) {
    saveBar.style.display = 'flex';
    updateSaveStatus();
  } else {
    saveBar.style.display = 'none';
  }
}

function buildPickCard(game, t1, t2, winner, isOpen, savedPicks, cfg) {
  const card = document.createElement('div');
  card.className = 'pick-card';
  const liveScore = findGameScore(t1, t2);

  const regionLabel = game.label || (game.region ? `${game.region}` : '');
  const hdr = document.createElement('div');
  hdr.className = 'pick-card-hdr';
  let hdrExtra = '';
  if (liveScore && liveScore.status === 'in') {
    hdrExtra = ` <span class="game-live-tag" style="font-size:0.65rem;padding:1px 6px;margin-left:0.2rem">${liveScore.statusDetail || 'LIVE'}</span>`;
  } else if (liveScore && liveScore.status === 'post') {
    hdrExtra = ' <span class="pick-card-status-final">— Final</span>';
  }
  hdr.innerHTML = `<span class="pick-card-hdr-label">${esc(regionLabel)}${hdrExtra}</span>
    <span class="pick-pts">${cfg.pts} pt${cfg.pts > 1 ? 's' : ''}</span>`;
  card.appendChild(hdr);

  if (!t1 && !t2) {
    const tbd = document.createElement('div');
    tbd.className = 'pick-tbd';
    tbd.textContent = 'Matchup TBD — teams not yet determined';
    card.appendChild(tbd);
    return card;
  }

  const savedPick = savedPicks[game.id];

  const isAdminPeek = !!state.adminViewPlayer;
  [t1, t2].forEach(team => {
    if (!team) return;
    const isPicked        = isAdminPeek ? (savedPick === team.name) : (state.pendingPicks[game.id] === team.name);
    const isPlayerPick    = savedPick === team.name;
    const row = document.createElement('div');
    row.className = 'pick-option';
    if (!isOpen) row.classList.add('disabled');
    if (isPicked) row.classList.add('selected');

    // Only apply result styling to the player's own saved pick row
    let resultMark = '';
    if (winner) {
      const teamWon = winner.name === team.name;
      if (isPlayerPick) {
        // Highlight the player's own pick as correct or wrong
        if (teamWon) {
          resultMark = '<span class="pick-o-result correct">✔ Correct</span>';
          row.classList.add('result-correct');
        } else {
          resultMark = '<span class="pick-o-result wrong">✘ Wrong</span>';
          row.classList.add('result-wrong');
        }
      } else if (teamWon) {
        // Show who actually won (but this isn't the player's pick)
        resultMark = '<span class="pick-o-result won">WON</span>';
      }
    }

    const radio = document.createElement('input');
    radio.type  = 'radio';
    radio.name  = `game-${game.id}`;
    radio.value = team.name;
    radio.checked = isPicked;
    radio.disabled = !isOpen;

    const teamPts = calcPickPoints(game, team.name, cfg);
    const ptsTxt  = Number.isInteger(teamPts)
      ? `${teamPts} pt${teamPts !== 1 ? 's' : ''}`
      : `${teamPts} pts`;
    // Live score for this team
    let scoreHtml = '';
    if (liveScore) {
      const isT1 = t1 && team.name === t1.name;
      const teamScoreData = isT1 ? liveScore.t1 : liveScore.t2;
      const scoreClass = liveScore.status === 'post' ? 'score-final' : 'score-live';
      scoreHtml = `<span class="pick-o-score ${scoreClass}">${teamScoreData.score}</span>`;
    }
    row.innerHTML = `
      <span class="pick-o-seed">${team.seed}</span>
      <span class="pick-o-name">${esc(team.name)}</span>
      ${scoreHtml}
      <span class="pick-o-pts">${ptsTxt}</span>
      ${resultMark}`;
    row.insertBefore(radio, row.firstChild);

    if (isOpen) {
      row.addEventListener('click', () => {
        state.pendingPicks[game.id] = team.name;
        state.lastPickTime = Date.now();  // track for poll protection
        // Re-render pick card area
        document.querySelectorAll(`[name="game-${game.id}"]`).forEach(r => r.checked = false);
        radio.checked = true;
        document.querySelectorAll(`.pick-option`).forEach(el => {
          if (el.querySelector(`[name="game-${game.id}"]`)) {
            el.classList.remove('selected');
            if (el.querySelector(`[value="${team.name}"]`)) el.classList.add('selected');
          }
        });
        updateSaveStatus();
      });
    }
    card.appendChild(row);
  });

  return card;
}

function updateSaveStatus() {
  const statusEl = document.getElementById('save-status');
  if (!statusEl) return;
  const roundId = state.activePicksRound;
  const games = getGamesForRound(roundId);
  const picked = Object.keys(state.pendingPicks).filter(gid =>
    games.find(g => g.id === gid) && state.pendingPicks[gid]
  ).length;
  statusEl.textContent = `${picked} / ${games.length} games picked`;
}

async function savePicks() {
  const pid = state.currentPlayer;
  const rid = state.activePicksRound;
  if (!pid) return;
  if (!state.picks[pid]) state.picks[pid] = {};
  // Only save picks with game IDs that belong to this round
  const validPicks = {};
  for (const [gid, val] of Object.entries(state.pendingPicks)) {
    if (gid.startsWith(rid + '-')) validPicks[gid] = val;
  }
  state.picks[pid][rid] = validPicks;
  try {
    await saveState();
    showToast('Picks saved!', 'success');
  } catch (e) {
    showToast('Save failed — please try again!', 'error');
  }
  renderPicks();
}

// ── LEADERBOARD RENDERING ─────────────────────────────────────

function renderLeaderboard() {
  renderLbTabs();
  renderLbBody();
}

function renderLbTabs() {
  const tabs = document.getElementById('lb-tabs');
  tabs.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'round-tab' + (state.lbRound === 'all' ? ' active' : '');
  allBtn.textContent = 'Total';
  allBtn.addEventListener('click', () => { state.lbRound = 'all'; renderLeaderboard(); });
  tabs.appendChild(allBtn);

  ROUND_CONFIG.forEach(cfg => {
    const btn = document.createElement('button');
    btn.className = 'round-tab' + (state.lbRound === cfg.id ? ' active' : '');
    btn.textContent = cfg.short;
    btn.addEventListener('click', () => { state.lbRound = cfg.id; renderLeaderboard(); });
    tabs.appendChild(btn);
  });
}

function renderLbBody() {
  const body = document.getElementById('lb-body');
  if (!state.players.length) {
    body.innerHTML = '<div class="empty-state"><div class="es-icon">&#128202;</div>No players yet. Add players in Admin.</div>';
    return;
  }

  // Calculate scores
  const rows = state.players.map(p => {
    const total  = getPlayerTotalScore(p.id);
    const byRound = {};
    ROUND_CONFIG.forEach(cfg => {
      byRound[cfg.id] = getPlayerRoundScore(p.id, cfg.id);
    });
    return { player: p, total, byRound };
  });

  // Sort by total score desc, then by possible (higher upside first), then by name
  rows.sort((a, b) => {
    if (b.total.total !== a.total.total) return b.total.total - a.total.total;
    if (b.total.possible !== a.total.possible) return b.total.possible - a.total.possible;
    return a.player.name.localeCompare(b.player.name);
  });

  const table = document.createElement('table');
  table.className = 'lb-table';

  // Determine "on fire" player — whoever scored the most points in the last 4 decided games
  // Collect all decided games across all rounds, ordered by round (latest first), then by game index (latest first)
  const allDecided = [];
  for (let ri = ROUND_CONFIG.length - 1; ri >= 0; ri--) {
    const rid = ROUND_CONFIG[ri].id;
    const cfg = ROUND_CONFIG[ri];
    const games = getGamesForRound(rid).filter(g => state.results[g.id]);
    // Reverse so higher-indexed games (which tend to finish later) come first
    games.reverse().forEach(g => allDecided.push({ game: g, cfg }));
  }
  const recentGames = allDecided.slice(0, 4);
  // Score each player's streak across the last 4 games, then rank top 3
  const streakScores = [];
  if (recentGames.length > 0) {
    rows.forEach(r => {
      let streak = 0;
      recentGames.forEach(({ game, cfg }) => {
        const pick = ((state.picks[r.player.id] || {})[cfg.id] || {})[game.id];
        if (pick && pick === state.results[game.id]) {
          streak += calcPickPoints(game, pick, cfg);
        }
      });
      streakScores.push({ id: r.player.id, streak, total: r.total.total, name: r.player.name });
    });
    streakScores.sort((a, b) => b.streak - a.streak || b.total - a.total || a.name.localeCompare(b.name));
  }
  // Map player IDs to fire level: 3🔥, 2🔥, 1🔥
  const fireMap = {};
  if (streakScores.length >= 1 && streakScores[0].streak > 0) fireMap[streakScores[0].id] = 3;
  if (streakScores.length >= 2 && streakScores[1].streak > 0) fireMap[streakScores[1].id] = 2;
  if (streakScores.length >= 3 && streakScores[2].streak > 0) fireMap[streakScores[2].id] = 1;

  // Compute best score per round (for highlighting)
  const roundBest = {};
  ROUND_CONFIG.forEach(cfg => {
    const hasAny = rows.some(r => r.byRound[cfg.id].correct > 0 || r.byRound[cfg.id].wrong > 0);
    if (!hasAny) return;
    let best = 0;
    rows.forEach(r => { if (r.byRound[cfg.id].score > best) best = r.byRound[cfg.id].score; });
    if (best > 0) roundBest[cfg.id] = best;
  });

  // Determine "Upset Queen" — player with the most points earned from upset picks
  let upsetQueenId = null;
  let bestUpsetPts = 0;
  rows.forEach(r => {
    let upsetPts = 0;
    ROUND_CONFIG.forEach(cfg => {
      const roundPicks = (state.picks[r.player.id] || {})[cfg.id] || {};
      getGamesForRound(cfg.id).forEach(game => {
        const pick = roundPicks[game.id];
        const result = state.results[game.id];
        if (!pick || pick !== result) return;
        const { t1, t2 } = getTeams(game);
        if (!t1 || !t2) return;
        const fav = t1.seed <= t2.seed ? t1 : t2;
        const dog = fav === t1 ? t2 : t1;
        if (dog.seed !== fav.seed && pick === dog.name) {
          upsetPts += calcPickPoints(game, pick, cfg) - cfg.pts; // bonus portion only
        }
      });
    });
    if (upsetPts > bestUpsetPts || (upsetPts === bestUpsetPts && r.total.total > (rows.find(x => x.player.id === upsetQueenId)?.total.total || 0))) {
      bestUpsetPts = upsetPts;
      upsetQueenId = r.player.id;
    }
  });
  if (bestUpsetPts <= 0) upsetQueenId = null;

  // Header
  const thead = document.createElement('thead');
  let thHTML = '<tr><th>#</th><th>Player</th>';
  if (state.lbRound === 'all') {
    thHTML += '<th>Score</th>';
    ROUND_CONFIG.forEach(cfg => { thHTML += `<th class="num">${cfg.short}</th>`; });
  } else {
    thHTML += '<th class="num">Score</th>';
  }
  thHTML += '</tr>';
  thead.innerHTML = thHTML;
  table.appendChild(thead);

  // Pre-compute whether other players' picks are visible for the viewed round
  const lbViewRound  = state.lbRound === 'all' ? state.currentRound : state.lbRound;
  const picksVisible = isRoundPicksVisible(lbViewRound);

  const tbody = document.createElement('tbody');
  rows.forEach((row, i) => {
    const rank = i + 1;
    const isMe = row.player.id === (state.sessionPlayer || state.currentPlayer);
    const tr   = document.createElement('tr');
    if (isMe) tr.classList.add('me');

    const rankCls = rank === 1 ? 'top1' : rank === 2 ? 'top2' : rank === 3 ? 'top3' : '';
    const rankIcon = rank === 1 ? '&#127942;' : rank === 2 ? '&#129352;' : rank === 3 ? '&#129353;' : rank;
    const nameClass = isMe ? 'lb-player me' : 'lb-player';

    // Picks are hidden for the current open/locked round — but never lock your own row
    const isOwnRow   = row.player.id === (state.sessionPlayer || state.currentPlayer);
    const cantPeek   = !isAdmin() && !isOwnRow;
    const linkLocked = cantPeek || (!picksVisible && !isOwnRow);
    const lockTag    = linkLocked ? ' <span class="lb-lock-icon">&#128274;</span>' : '';
    const btnClass   = linkLocked ? 'lb-player-link picks-locked' : 'lb-player-link';
    const btnTitle   = cantPeek ? ' title="You can only view your own picks"'
      : linkLocked ? ' title="Picks revealed when the round is closed"' : '';

    const fireLevel = fireMap[row.player.id] || 0;
    const fireEmojis = '&#128293;'.repeat(fireLevel);
    const fireTag = fireLevel ? ` <span class="lb-fire lb-fire-${fireLevel}" title="Hot streak — top scorer in the last 4 games">${fireEmojis}</span>` : '';
    const queenTag = upsetQueenId === row.player.id ? ' <span class="lb-queen-emoji" title="Most points from upsets">&#128120;</span><span class="lb-upset-queen"> Upset Kween!!!!!</span>' : '';
    const avatar = playerAvatarHtml(row.player.name, 42);
    let tdHTML = `<td class="rank-num ${rankCls}">${rankIcon}</td>
      <td class="${nameClass}">
        ${avatar}<button class="${btnClass}" data-pid="${row.player.id}"${btnTitle}>${esc(row.player.name)}${lockTag}</button>${fireTag}${queenTag}
      </td>`;

    if (state.lbRound === 'all') {
      const maxScore = ROUND_CONFIG.reduce((sum, cfg) => sum + cfg.pts * getGamesForRound(cfg.id).length, 0);
      const pctW = Math.min(100, Math.round((row.total.total / maxScore) * 100));
      const wl = row.total.correct || row.total.wrong
        ? `<span class="lb-wl"><span class="lb-w">${row.total.correct}✔</span> <span class="lb-l">${row.total.wrong}✘</span></span>`
        : '';
      tdHTML += `<td><span class="lb-total">${fmtScore(row.total.total)}</span>${wl}
          <div class="pct-bar-wrap"><div class="pct-bar" style="width:${pctW}%"></div></div></td>`;
      ROUND_CONFIG.forEach(cfg => {
        const s = row.byRound[cfg.id];
        const wlTip = s.correct || s.wrong ? ` title="${s.correct}✔ ${s.wrong}✘"` : '';
        const isBest = roundBest[cfg.id] && s.score === roundBest[cfg.id];
        tdHTML += `<td class="lb-round-score num ${s.score === 0 && !s.correct && !s.wrong ? 'zero' : ''}${isBest ? ' round-best' : ''}"${wlTip}>${fmtScore(s.score)}</td>`;
      });
    } else {
      const s = row.byRound[state.lbRound];
      const wl = s.correct || s.wrong
        ? `<div class="lb-wl-row"><span class="lb-w">${s.correct} correct</span> <span class="lb-l">${s.wrong} wrong</span></div>`
        : '';
      const isBestRound = roundBest[state.lbRound] && s.score === roundBest[state.lbRound];
      tdHTML += `<td class="num${isBestRound ? ' round-best' : ''}"><span class="lb-total">${fmtScore(s.score)}</span>${wl}</td>`;
    }

    tr.innerHTML = tdHTML;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  body.innerHTML = '';
  body.appendChild(table);

  // Click player name → view picks (admin can peek; non-admins only own row)
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.lb-player-link');
    if (!btn) return;
    const pid = btn.dataset.pid;
    if (btn.classList.contains('picks-locked')) {
      const isOwnPid = pid === (state.sessionPlayer || state.currentPlayer);
      showToast(!isAdmin() && !isOwnPid
        ? 'You can only view your own picks'
        : 'Picks are revealed once the Admin closes this round', 'info');
      return;
    }
    const roundId = state.lbRound === 'all' ? state.currentRound : state.lbRound;
    const isOwnPid = pid === (state.sessionPlayer || state.currentPlayer);
    if (isOwnPid) {
      // Own row: go to own picks without admin-peek mode
      state.adminViewPlayer  = null;
      state.currentPlayer    = pid;
      state.activePicksRound = roundId;
    } else {
      // Admin peeking at another player
      state.adminViewPlayer  = pid;
      state.activePicksRound = roundId;
    }
    switchView('picks');
  });
}

// ── PICKS AUTO-FIX ────────────────────────────────────────────
// Called every time a result is entered/cleared.
// Scans every player × round × game; wherever the stored pick no longer
// matches either actual team in that slot, replaces it with a random
// valid team so all players always have a pick in every resolved game.

function fixInvalidPicks() {
  let fixed = 0;
  state.players.forEach(p => {
    if (!state.picks[p.id]) state.picks[p.id] = {};
    ROUND_CONFIG.forEach(cfg => {
      if (!state.picks[p.id][cfg.id]) state.picks[p.id][cfg.id] = {};
      getGamesForRound(cfg.id).forEach(g => {
        const { t1, t2 } = getTeams(g);
        if (!t1 || !t2) return;           // teams not yet determined — skip
        const stored = state.picks[p.id][cfg.id][g.id];
        if (stored !== t1.name && stored !== t2.name) {
          state.picks[p.id][cfg.id][g.id] = Math.random() < 0.5 ? t1.name : t2.name;
          fixed++;
        }
      });
    });
  });
  if (fixed > 0) saveState();
  return fixed;
}

// ── ADMIN BONUS ANSWERS ───────────────────────────────────────

function renderBonusAdmin() {
  const container = document.getElementById('bonus-answers-grid');
  if (!container) return;
  container.innerHTML = '';

  // Use the main results round selector instead of a separate one
  const roundSel = document.getElementById('results-round-sel');
  const roundId = roundSel ? roundSel.value : state.currentRound;
  const bonuses = BONUS_CONFIG[roundId] || [];

  if (!bonuses.length) {
    container.innerHTML = '<div class="result-tbd">No bonus questions for this round.</div>';
    return;
  }

  bonuses.forEach(b => {
    const card = document.createElement('div');
    card.className = 'bonus-admin-card';

    const hdr = document.createElement('div');
    hdr.className = 'bonus-admin-hdr';
    hdr.innerHTML = `<span>${esc(b.label)}</span><span class="bonus-pts">${b.points} pts</span>`;
    card.appendChild(hdr);

    const correctAns = state.bonusAnswers[b.id];

    if (b.type === 'multi') {
      // Auto-populate from actual E8 results
      const e8Games = getGamesForRound('e8');
      const actualWinners = e8Games.map(g => {
        const w = getWinner(g.id);
        return w ? w.name : '';
      });
      // Persist into bonusAnswers so scoring works
      state.bonusAnswers[b.id] = actualWinners;

      for (let i = 0; i < actualWinners.length; i++) {
        const row = document.createElement('div');
        row.className = 'bonus-input-row';
        const label = document.createElement('span');
        label.className = 'bonus-input-label';
        label.textContent = `Team ${i + 1}:`;
        row.appendChild(label);
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'bonus-input admin-bonus-input';
        inp.placeholder = 'From entered results...';
        inp.value = actualWinners[i] || '';
        inp.disabled = true;  // read-only — driven by actual results
        inp.dataset.bonusId = b.id;
        inp.dataset.bonusIdx = i;
        row.appendChild(inp);
        card.appendChild(row);
      }
    } else if (b.type === 'select' && b.options) {
      const row = document.createElement('div');
      row.className = 'bonus-input-row';
      const sel = document.createElement('select');
      sel.className = 'bonus-input admin-bonus-input';
      sel.dataset.bonusId = b.id;
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = '— Select correct answer —';
      sel.appendChild(defOpt);
      b.options.forEach(optText => {
        const o = document.createElement('option');
        o.value = optText;
        o.textContent = optText;
        if (correctAns === optText) o.selected = true;
        sel.appendChild(o);
      });
      row.appendChild(sel);
      card.appendChild(row);
    } else {
      const row = document.createElement('div');
      row.className = 'bonus-input-row';
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'bonus-input admin-bonus-input';
      inp.placeholder = 'Enter correct answer...';
      inp.value = correctAns || '';
      inp.dataset.bonusId = b.id;
      row.appendChild(inp);
      card.appendChild(row);
    }

    container.appendChild(card);
  });
}

function saveBonusAnswers() {
  const inputs = document.querySelectorAll('.admin-bonus-input');
  inputs.forEach(inp => {
    const bid = inp.dataset.bonusId;
    const idx = inp.dataset.bonusIdx;
    if (idx !== undefined) {
      if (!state.bonusAnswers[bid] || !Array.isArray(state.bonusAnswers[bid])) {
        const bonus = Object.values(BONUS_CONFIG).flat().find(b => b.id === bid);
        state.bonusAnswers[bid] = new Array(bonus ? bonus.count : 4).fill('');
      }
      state.bonusAnswers[bid][parseInt(idx)] = inp.value.trim();
    } else {
      state.bonusAnswers[bid] = inp.value.trim();
    }
  });
  saveState();
  showToast('Bonus answers saved!', 'success');
}

// ── DEMO DATA ─────────────────────────────────────────────────

function loadDemoData() {
  // Upset-heavy demo bracket using 2025-26 teams.
  state.results = {
    // ── EAST ──────────────────────────────────────────────────────
    // R64: Duke(1)✓  TCU(9)>OhioSt(8)  N.Iowa(12)>StJohns(5)  Kansas(4)✓
    //      S.Florida(11)>Louisville(6)  MichSt(3)✓  UCF(10)>UCLA(7)  Furman(15)>UConn(2)
    'r64-east-0':'Duke',            'r64-east-1':'TCU',
    'r64-east-2':'Northern Iowa',   'r64-east-3':'Kansas',
    'r64-east-4':'South Florida',   'r64-east-5':'Michigan St',
    'r64-east-6':'UCF',             'r64-east-7':'Furman',
    // R32: Duke>TCU  Kansas>N.Iowa  MichSt>S.Florida  Furman>UCF
    'r32-east-0':'Duke',            'r32-east-1':'Kansas',
    'r32-east-2':'Michigan St',     'r32-east-3':'Furman',
    // S16: Duke>Kansas  Furman>MichSt (15-seed Cinderella!)
    's16-east-0':'Duke',            's16-east-1':'Furman',
    // E8: Duke ends the Cinderella run
    'e8-east-0':'Duke',

    // ── WEST ──────────────────────────────────────────────────────
    // R64: Arizona(1)✓  UtahSt(9)>Villanova(8)  HighPoint(12)>Wisconsin(5)  Arkansas(4)✓
    //      Texas(11)>BYU(6)  Gonzaga(3)✓  Missouri(10)>Miami(7)  Purdue(2)✓
    'r64-west-0':'Arizona',         'r64-west-1':'Utah State',
    'r64-west-2':'High Point',      'r64-west-3':'Arkansas',
    'r64-west-4':'Texas',     'r64-west-5':'Gonzaga',
    'r64-west-6':'Missouri',        'r64-west-7':'Purdue',
    // R32: Arizona>UtahSt  Arkansas>HighPoint  Gonzaga>Texas  Purdue>Missouri
    'r32-west-0':'Arizona',         'r32-west-1':'Arkansas',
    'r32-west-2':'Gonzaga',         'r32-west-3':'Purdue',
    // S16: Arkansas(4)>Arizona(1) UPSET!  Purdue(2)>Gonzaga(3)
    's16-west-0':'Arkansas',        's16-west-1':'Purdue',
    // E8: Purdue > Arkansas
    'e8-west-0':'Purdue',

    // ── SOUTH ─────────────────────────────────────────────────────
    // R64: Florida(1)✓  Iowa(9)>Clemson(8)  McNeese(12)>Vanderbilt(5)  Nebraska(4)✓
    //      N.Carolina(6)✓  Illinois(3)✓  TexasAM(10)>StMarys(7)  Houston(2)✓
    'r64-south-0':'Florida',        'r64-south-1':'Iowa',
    'r64-south-2':'McNeese',        'r64-south-3':'Nebraska',
    'r64-south-4':'North Carolina', 'r64-south-5':'Illinois',
    'r64-south-6':'Texas A&M',      'r64-south-7':'Houston',
    // R32: Florida>Iowa  Nebraska>McNeese  Illinois>N.Carolina  Houston>TexasAM
    'r32-south-0':'Florida',        'r32-south-1':'Nebraska',
    'r32-south-2':'Illinois',       'r32-south-3':'Houston',
    // S16: Florida>Nebraska  Houston(2)>Illinois(3)
    's16-south-0':'Florida',        's16-south-1':'Houston',
    // E8: Houston(2)>Florida(1) UPSET!
    'e8-south-0':'Houston',

    // ── MIDWEST ───────────────────────────────────────────────────
    // R64: Michigan(1)✓  StLouis(9)>Georgia(8)  Akron(12)>TexasTech(5)  Alabama(4)✓
    //      Miami OH(11)>Tennessee(6)  Virginia(3)✓  SantaClara(10)>Kentucky(7)  IowaState(2)✓
    'r64-midwest-0':'Michigan',     'r64-midwest-1':'Saint Louis',
    'r64-midwest-2':'Akron',        'r64-midwest-3':'Alabama',
    'r64-midwest-4':'Miami OH',   'r64-midwest-5':'Virginia',
    'r64-midwest-6':'Santa Clara',  'r64-midwest-7':'Iowa State',
    // R32: Michigan>StLouis  Alabama>Akron  Virginia>MIAOH/SMU  IowaState>SantaClara
    'r32-midwest-0':'Michigan',     'r32-midwest-1':'Alabama',
    'r32-midwest-2':'Virginia',     'r32-midwest-3':'Iowa State',
    // S16: Alabama(4)>Michigan(1) UPSET!  Iowa State(2)>Virginia(3)
    's16-midwest-0':'Alabama',      's16-midwest-1':'Iowa State',
    // E8: Iowa State(2)>Alabama(4)
    'e8-midwest-0':'Iowa State',

    // ── FINAL FOUR ────────────────────────────────────────────────
    // F4-0: West(Purdue,2) vs East(Duke,1) → Duke
    // F4-1: South(Houston,2) vs Midwest(IowaState,2) → Houston
    'f4-0':'Duke',                  'f4-1':'Houston',
    // Championship: Duke(1) beats Houston(2)
    'champ-0':'Duke',
  };

  state.currentRound = 'champ';
  state.roundStatus  = 'closed';

  // Generate structured demo picks: each player covers every game with a
  // seeded (deterministic) RNG biased by their personal "boldness" score —
  // bold players pick more lower-seeded upsets, chalk players stick to favorites.
  // Boldness 0 = always pick the favorite; 1 = pick upsets very aggressively.
  // One boldness value per player (Commish, Etty, Colm, Bergman, Josh, Michael)
  const DEMO_BOLDNESS = [0.22, 0.48, 0.14, 0.38, 0.55, 0.30];

  // Mulberry32 seeded PRNG — deterministic, fast.
  function mkRng(seed) {
    let s = seed >>> 0;
    return function() {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  state.players.forEach((player, pi) => {
    const boldness = DEMO_BOLDNESS[Math.min(pi, DEMO_BOLDNESS.length - 1)];
    const rng = mkRng(pi * 7919 + 1337);
    if (!state.picks[player.id]) state.picks[player.id] = {};
    ROUND_CONFIG.forEach(cfg => {
      if (!state.picks[player.id][cfg.id]) state.picks[player.id][cfg.id] = {};
      getGamesForRound(cfg.id).forEach(game => {
        const { t1, t2 } = getTeams(game);
        if (!t1 || !t2) return;
        const fav = t1.seed <= t2.seed ? t1 : t2;
        const dog = t1 === fav ? t2 : t1;
        // Probability of picking the underdog scales with seed gap and boldness.
        // A 16v1 gap (15 pts) at boldness 0.50 → 50% chance of picking the upset.
        const upsetProb = boldness * (dog.seed - fav.seed) / 15;
        state.picks[player.id][cfg.id][game.id] = rng() < upsetProb ? dog.name : fav.name;
      });
    });

    // Generate bonus picks for each round from available options
    if (!state.bonusPicks[player.id]) state.bonusPicks[player.id] = {};
    const demoPlayerNames = ['Cooper Flagg', 'Dylan Harper', 'Ace Bailey', 'VJ Edgecombe', 'Kasparas Jakucionis', 'Johni Broome'];
    Object.keys(BONUS_CONFIG).forEach(roundId => {
      BONUS_CONFIG[roundId].forEach(b => {
        if (b.type === 'multi') {
          // e8_teams: auto-populated from player's E8 picks
          const e8Games = getGamesForRound('e8');
          const e8Picks = (state.picks[player.id] || {})['e8'] || {};
          state.bonusPicks[player.id][b.id] = e8Games.map(g => e8Picks[g.id] || '');
        } else if (b.type === 'select' && b.options) {
          // Pick a random option from the dropdown
          const opts = Array.isArray(b.options) ? b.options : ALL_TEAM_NAMES;
          const idx = Math.floor(rng() * opts.length);
          state.bonusPicks[player.id][b.id] = opts[idx];
        } else {
          // Free text — pick a random player name for demo
          const nameIdx = Math.floor(rng() * demoPlayerNames.length);
          state.bonusPicks[player.id][b.id] = demoPlayerNames[nameIdx];
        }
      });
    });
  });

  // Set correct bonus answers for ALL bonus questions
  const e8Games = getGamesForRound('e8');
  state.bonusAnswers = {
    r64_conf: 'Big 12 Conference',
    r32_buzzer: '3',
    s16_diff: '22',
    e8_scorer: 'Cooper Flagg',
    e8_teams: e8Games.map(g => { const w = getWinner(g.id); return w ? w.name : ''; }),
    f4_team3: 'Duke',
    f4_num3: '12',
  };

  // Full overwrite save (no _sender) so ALL players' picks are persisted
  const payload = {
    currentRound: state.currentRound,
    roundStatus: state.roundStatus,
    players: state.players,
    results: state.results,
    picks: state.picks,
    rulesText: state.rulesText,
    defaultPlayersKey: DEFAULT_PLAYERS_KEY,
    bonusPicks: state.bonusPicks,
    bonusAnswers: state.bonusAnswers,
    playerPins: state.playerPins,
  };
  fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => console.warn('Demo save failed:', err));
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch(e) {}
}

// ── ADMIN RENDERING ───────────────────────────────────────────

function renderAdmin() {
  populateRoundSelects();
  renderPickStatusGrid();
  renderResultsGrid();
  renderPlayersList();
  renderPinsAdmin();
  renderBonusAdmin();
}

function renderPickStatusGrid() {
  const container = document.getElementById('pick-status-grid');
  if (!container) return;
  container.innerHTML = '';

  // Build table
  const table = document.createElement('table');
  table.className = 'pick-status-table';

  // Header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const playerTh = document.createElement('th');
  playerTh.textContent = 'Player';
  headerRow.appendChild(playerTh);
  ROUND_CONFIG.forEach(cfg => {
    const th = document.createElement('th');
    th.textContent = cfg.short;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body rows — one per player
  const tbody = document.createElement('tbody');
  state.players.forEach(p => {
    const row = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.textContent = p.name;
    nameTd.className = 'pick-status-name';
    row.appendChild(nameTd);

    ROUND_CONFIG.forEach(cfg => {
      const td = document.createElement('td');
      td.className = 'pick-status-cell';
      const games = getGamesForRound(cfg.id);
      // Only count games where both teams are determined
      const playableGames = games.filter(g => {
        const { t1, t2 } = getTeams(g);
        return t1 && t2;
      });
      const playerPicks = (state.picks[p.id] || {})[cfg.id] || {};
      const picked = playableGames.filter(g => playerPicks[g.id]).length;
      const totalPlayable = playableGames.length;
      const totalExpected = games.length; // all games in this round

      if (totalPlayable === 0) {
        td.textContent = '—';
        td.classList.add('pick-status-na');
      } else if (picked === totalExpected) {
        // All games in the round are picked (round fully complete)
        td.textContent = '✓';
        td.classList.add('pick-status-complete');
      } else if (picked === totalPlayable && totalPlayable < totalExpected) {
        // Picked all available games, but round isn't fully determined yet
        td.textContent = `${picked}/${totalExpected}`;
        td.classList.add('pick-status-partial');
      } else if (picked > 0) {
        td.textContent = `${picked}/${totalExpected}`;
        td.classList.add('pick-status-partial');
      } else {
        td.textContent = '✗';
        td.classList.add('pick-status-none');
      }
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

function renderPinsAdmin() {
  const container = document.getElementById('pins-grid');
  if (!container) return;
  container.innerHTML = '';

  state.players.forEach(p => {
    const row = document.createElement('div');
    row.className = 'pin-admin-row';
    const label = document.createElement('span');
    label.className = 'pin-admin-name';
    label.textContent = p.name;
    row.appendChild(label);
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'bonus-input pin-admin-input';
    inp.maxLength = 4;
    inp.inputMode = 'numeric';
    inp.pattern = '[0-9]*';
    inp.placeholder = 'No PIN';
    inp.value = state.playerPins[p.id] || '';
    inp.dataset.playerId = p.id;
    row.appendChild(inp);
    container.appendChild(row);
  });
}

async function savePins() {
  const inputs = document.querySelectorAll('.pin-admin-input');
  inputs.forEach(inp => {
    const pid = inp.dataset.playerId;
    const val = inp.value.trim();
    if (val && /^\d{1,4}$/.test(val)) {
      state.playerPins[pid] = val;
    } else {
      delete state.playerPins[pid];
    }
  });
  try {
    await saveState();
    showToast('PINs saved!', 'success');
  } catch (e) {
    showToast('Failed to save PINs — try again', 'error');
  }
}

function populateRoundSelects() {
  ['admin-round-sel', 'results-round-sel'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    const cur = sel.value || state.currentRound;
    sel.innerHTML = '';
    ROUND_CONFIG.forEach(cfg => {
      const opt = document.createElement('option');
      opt.value = cfg.id;
      opt.textContent = cfg.label;
      if (cfg.id === cur) opt.selected = true;
      sel.appendChild(opt);
    });
  });

  const statusSel = document.getElementById('admin-status-sel');
  if (statusSel) statusSel.value = state.roundStatus;

  const roundSel = document.getElementById('admin-round-sel');
  if (roundSel) roundSel.value = state.currentRound;
}

function renderResultsGrid() {
  const grid = document.getElementById('results-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const roundSel = document.getElementById('results-round-sel');
  const roundId  = roundSel ? roundSel.value : state.currentRound;

  const games = getGamesForRound(roundId);

  if (!games.length) {
    grid.innerHTML = '<div class="result-tbd">No games found.</div>';
    return;
  }

  games.forEach(game => {
    const { t1, t2 } = getTeams(game);
    const winner = getWinner(game.id);

    const card = document.createElement('div');
    card.className = 'result-game';

    const lbl = document.createElement('div');
    lbl.className = 'result-game-hdr';
    lbl.textContent = game.label || (game.region || '');
    card.appendChild(lbl);

    if (!t1 && !t2) {
      const tbd = document.createElement('div');
      tbd.className = 'result-tbd';
      tbd.textContent = 'Matchup TBD';
      card.appendChild(tbd);
    } else {
      const teamsRow = document.createElement('div');
      teamsRow.className = 'result-teams';

      [t1, t2].forEach((team, idx) => {
        if (!team) return;
        const btn = document.createElement('button');
        btn.className = 'result-team-btn';
        if (winner && winner.name === team.name) btn.classList.add('chosen');
        btn.textContent = `(${team.seed}) ${team.name}`;
        btn.addEventListener('click', () => {
          if (winner && winner.name === team.name) {
            // Toggle off
            delete state.results[game.id];
          } else {
            state.results[game.id] = team.name;
          }
          // Auto-fix any player picks that are now invalid given the new result
          const fixed = fixInvalidPicks();
          saveState();
          if (fixed > 0) showToast(`Result set: ${team.name} · ${fixed} pick${fixed !== 1 ? 's' : ''} auto-filled`, 'success');
          else showToast(`Result set: ${team.name}`, 'success');
          renderResultsGrid();
          // Refresh bracket if visible
          if (state.currentView === 'bracket') renderBracket();
        });
        teamsRow.appendChild(btn);

        if (idx === 0) {
          const vs = document.createElement('span');
          vs.className = 'result-vs';
          vs.textContent = 'vs';
          teamsRow.appendChild(vs);
        }
      });

      card.appendChild(teamsRow);
    }

    grid.appendChild(card);
  });
}

function renderPlayersList() {
  const list = document.getElementById('players-list');
  if (!list) return;
  list.innerHTML = '';

  if (!state.players.length) {
    list.innerHTML = '<div style="color:var(--text-3);font-size:0.8rem">No players yet.</div>';
    return;
  }

  state.players.forEach(p => {
    const { total } = getPlayerTotalScore(p.id);
    const item = document.createElement('div');
    item.className = 'player-item';
    item.innerHTML = `
      <span class="player-item-name">${esc(p.name)}</span>
      <span class="player-item-score">${total} pts</span>
      <button class="player-item-del" data-id="${p.id}">Remove</button>`;
    item.querySelector('.player-item-del').addEventListener('click', () => {
      if (!confirm(`Remove ${p.name}? This will delete all their picks.`)) return;
      state.players = state.players.filter(x => x.id !== p.id);
      delete state.picks[p.id];
      if (state.currentPlayer === p.id) {
        state.currentPlayer = state.players[0]?.id || null;
      }
      saveState();
      showToast(`${p.name} removed`, 'info');
      updatePlayerSelect();
      renderPlayersList();
    });
    list.appendChild(item);
  });
}

// ── UTILITY ───────────────────────────────────────────────────

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── EVENT HANDLERS ────────────────────────────────────────────

function setupEvents() {
  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Session switch (non-admin "Switch" button)
  document.getElementById('session-switch-btn')?.addEventListener('click', logoutSession);

  // Player select (admin dropdown)
  document.getElementById('player-select').addEventListener('change', e => {
    state.currentPlayer   = e.target.value;
    state.adminViewPlayer = null;   // exit any admin peek view
    state.pendingPicks = {};        // reset pending picks for new player
    state.pendingPicksRound = null;
    state.pendingPicksPlayer = null;
    renderCurrentView();
  });

  // Save picks
  document.getElementById('save-picks-btn')?.addEventListener('click', savePicks);

  // Save rules (admin)
  document.getElementById('save-rules-btn')?.addEventListener('click', saveRules);

  // Admin: set round
  document.getElementById('set-round-btn')?.addEventListener('click', () => {
    const roundSel  = document.getElementById('admin-round-sel');
    const statusSel = document.getElementById('admin-status-sel');
    state.currentRound  = roundSel.value;
    state.roundStatus   = statusSel.value;
    saveState();
    updateRoundStatus();
    showToast(`Round set to ${ROUND_CONFIG.find(r => r.id === state.currentRound)?.label}`, 'success');
  });

  // Admin: update status separately
  document.getElementById('set-status-btn')?.addEventListener('click', () => {
    const statusSel = document.getElementById('admin-status-sel');
    state.roundStatus = statusSel.value;
    saveState();
    updateRoundStatus();
    showToast(`Status updated: ${state.roundStatus}`, 'info');
  });

  // Admin: results round change
  document.getElementById('results-round-sel')?.addEventListener('change', () => {
    renderResultsGrid();
    renderBonusAdmin();   // bonus section follows the same round selector
  });

  // Admin: save bonus answers
  document.getElementById('save-bonus-btn')?.addEventListener('click', saveBonusAnswers);

  // Admin: save PINs
  document.getElementById('save-pins-btn')?.addEventListener('click', savePins);

  // PIN modal: Enter key submits
  document.getElementById('pin-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitPin();
    if (e.key === 'Escape') closePinModal();
  });

  // Admin: add player
  document.getElementById('add-player-btn')?.addEventListener('click', () => {
    const input = document.getElementById('new-player-input');
    const name  = input.value.trim();
    if (!name) return;
    if (state.players.find(p => p.name.toLowerCase() === name.toLowerCase())) {
      showToast('Player already exists', 'error'); return;
    }
    const p = { id: uid(), name };
    state.players.push(p);
    if (!state.currentPlayer) state.currentPlayer = p.id;
    saveState();
    input.value = '';
    showToast(`${name} added!`, 'success');
    updatePlayerSelect();
    renderPlayersList();
  });

  // Admin: add player on Enter
  document.getElementById('new-player-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('add-player-btn').click();
  });

  // Admin: load demo data
  document.getElementById('demo-data-btn')?.addEventListener('click', () => {
    if (!confirm('Load demo results and auto-fill picks for all players?')) return;
    loadDemoData();
    showToast('Demo data loaded!', 'success');
    renderAdmin();
    renderBracket();
  });

  // Admin: reset
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (!confirm('Reset ALL data? This cannot be undone.')) return;
    state.results       = {};
    state.picks         = {};
    state.bonusPicks    = {};
    state.bonusAnswers  = {};
    state.playerPins    = {};
    state.players       = [...DEFAULT_PLAYERS.map(p => ({ ...p, id: uid() }))];
    state.currentRound  = 'r64';
    state.roundStatus   = 'open';
    state.currentPlayer = state.players[0]?.id || null;
    saveState();
    showToast('All data reset', 'info');
    updatePlayerSelect();
    renderAdmin();
  });
}

// ── INIT ──────────────────────────────────────────────────────

async function init() {
  state.games = buildGames();
  await loadState();

  // Seed default players locally if server returned none (UI fallback only — never save
  // defaults to server, which would overwrite real players like Jeremy & Callum)
  if (!state.players.length) {
    state.players = DEFAULT_PLAYERS.map(p => ({ ...p, id: uid() }));
    // Do NOT call saveState() here — these are just local defaults for the UI
  }
  if (!state.currentPlayer && state.players.length) {
    state.currentPlayer = state.players[0].id;
  }

  setupEvents();

  // Restore session from previous page load (skip PIN re-entry)
  const savedSession = sessionStorage.getItem('mm_session');
  if (savedSession && state.players.some(p => p.id === savedSession)) {
    loginAs(savedSession);
  } else {
    renderLoginOverlay();
  }

  startPolling();
  startScoresPolling();
}

// ── LIVE SCORES POLLING ──────────────────────────────────────
let scoresTimer = null;

async function fetchLiveScores() {
  try {
    const resp = await fetch('/api/scores');
    if (!resp.ok) return;
    const scores = await resp.json();
    if (scores && Object.keys(scores).length) {
      state.liveScores = scores;
      // Auto-set results from completed games (server handles this too,
      // but client-side as backup for immediate UI update)
      autoSetResultsFromScores();
      renderCurrentView();
    }
  } catch (e) { /* ignore */ }
}

// Automatically set game results when ESPN reports a game as final
function autoSetResultsFromScores() {
  if (!state.liveScores) return;
  let newResults = 0;

  // Check all bracket games across all rounds
  for (const game of Object.values(state.games)) {
    // Skip if result already set
    if (state.results[game.id]) continue;

    const { t1, t2 } = getTeams(game);
    if (!t1 || !t2) continue;

    const scoreData = findGameScore(t1, t2);
    if (!scoreData || scoreData.status !== 'post') continue;

    // Game is final — determine winner by score
    const score1 = parseInt(scoreData.t1.score) || 0;
    const score2 = parseInt(scoreData.t2.score) || 0;
    if (score1 === score2) continue; // shouldn't happen but skip ties

    // scoreData.t1/t2 are already matched to our bracket's t1/t2 order
    // (findGameScore handles order matching)
    const winnerName = score1 > score2 ? t1.name : t2.name;

    state.results[game.id] = winnerName;
    newResults++;
  }

  if (newResults > 0) {
    fixInvalidPicks();
    saveState();
    showToast(`${newResults} result${newResults > 1 ? 's' : ''} auto-updated from ESPN`, 'success');
  }
}

function startScoresPolling() {
  fetchLiveScores(); // immediate
  if (scoresTimer) clearInterval(scoresTimer);
  scoresTimer = setInterval(fetchLiveScores, 60000);
}

function stopScoresPolling() {
  if (scoresTimer) { clearInterval(scoresTimer); scoresTimer = null; }
}

// ── POLLING ──────────────────────────────────────────────────
// Fetch shared state every 8 seconds so all players see live updates.

let lastStateHash = '';
let pollTimer = null;

function startPolling() {
  // Poll immediately to get the hash baseline
  lastStateHash = JSON.stringify({
    currentRound: state.currentRound,
    roundStatus: state.roundStatus,
    results: state.results,
    picks: state.picks,
    players: state.players,
    rulesText: state.rulesText,
    bonusPicks: state.bonusPicks,
    bonusAnswers: state.bonusAnswers,
  });

  pollTimer = setInterval(pollServer, 8000);

  // Pause ALL polling when tab is hidden, resume on return
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(pollTimer);  pollTimer = null;
      stopScoresPolling();
    } else {
      pollServer(); // immediate refresh on return
      pollTimer = setInterval(pollServer, 8000);
      startScoresPolling();
    }
  });
}

function hasUnsavedPicks() {
  if (state.currentView !== 'picks') return false;
  const pending = state.pendingPicks || {};
  return Object.keys(pending).length > 0;
}

async function pollServer() {
  try {
    const res = await fetch('/api/state');
    if (!res.ok) return;
    const saved = await res.json();
    if (!saved || !Object.keys(saved).length) return;

    const newHash = JSON.stringify({
      currentRound: saved.currentRound,
      roundStatus: saved.roundStatus,
      results: saved.results,
      picks: saved.picks,
      players: saved.players,
      rulesText: saved.rulesText,
      bonusPicks: saved.bonusPicks,
      bonusAnswers: saved.bonusAnswers,
      playerPins: saved.playerPins,
    });

    if (newHash === lastStateHash) return; // nothing changed
    lastStateHash = newHash;

    // If user is actively making picks, preserve their unsaved work.
    // Use timestamp to capture picks made DURING the async fetch too.
    const prePickTime = state.lastPickTime || 0;
    const unsaved = hasUnsavedPicks();
    const savedPending = unsaved ? { ...state.pendingPicks } : null;
    const savedRound = state.pendingPicksRound;
    const savedPlayer = state.pendingPicksPlayer;

    applyLoadedState(saved);

    // Restore unsaved picks — but use CURRENT state.pendingPicks if user
    // made new picks during the fetch (lastPickTime changed)
    if (unsaved) {
      if (state.lastPickTime > prePickTime) {
        // User made new picks during fetch — keep current pendingPicks as-is
      } else if (savedPending) {
        state.pendingPicks = savedPending;
        state.pendingPicksRound = savedRound;
        state.pendingPicksPlayer = savedPlayer;
      }
    }

    renderCurrentView();
  } catch (e) {
    // silently ignore poll errors
  }
}

// ── UNSAVED PICKS WARNING ─────────────────────────────────────
// Warn users before they close the tab with unsaved picks
window.addEventListener('beforeunload', (e) => {
  if (Object.keys(state.pendingPicks || {}).length > 0) {
    e.preventDefault();
    e.returnValue = 'You have unsaved picks. Are you sure you want to leave?';
  }
});

// ── OFFLINE DETECTION ─────────────────────────────────────────
function updateOnlineStatus() {
  const banner = document.getElementById('offline-banner');
  if (banner) banner.style.display = navigator.onLine ? 'none' : 'block';
}
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

document.addEventListener('DOMContentLoaded', init);

// ── SERVICE WORKER (PWA) ──────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
