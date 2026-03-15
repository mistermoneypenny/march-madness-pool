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
    { id: 'r32_buzzer', label: 'Correct Number of Buzzer Beaters', points: 6, type: 'select', options: Array.from({length: 32}, (_, i) => String(i + 1)) },
  ],
  s16: [
    { id: 's16_diff', label: 'Highest Point Differential', points: 8, type: 'select', options: Array.from({length: 60}, (_, i) => String(i + 1)) },
  ],
  e8: [
    { id: 'e8_scorer', label: 'High Scorer (Player Name)', points: 10, type: 'text' },
    { id: 'e8_teams', label: 'Name the Four Elite Eight Winners', points: 25, type: 'multi', count: 4 },
  ],
  f4: [
    { id: 'f4_team3', label: 'Team with Most 3-Pointers', points: 6, type: 'select', options: '__ALL_TEAMS__' },
    { id: 'f4_num3', label: 'Number of 3-Pointers Made', points: 6, type: 'select', options: Array.from({length: 40}, (_, i) => String(i + 1)) },
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

// ── PLACEHOLDER TEAM DATA (update with 2026 bracket) ──────────
// Order within each region (pair by pair): 1vs16, 8vs9, 5vs12, 4vs13, 6vs11, 3vs14, 7vs10, 2vs15
const INITIAL_TEAMS = {
  East: [
    { seed: 1,  name: 'Duke'          },
    { seed: 16, name: 'Norfolk St'    },
    { seed: 8,  name: 'Iowa'          },
    { seed: 9,  name: 'UAB'           },
    { seed: 5,  name: 'Wisconsin'     },
    { seed: 12, name: 'Drake'         },
    { seed: 4,  name: 'Kansas'        },
    { seed: 13, name: 'Samford'       },
    { seed: 6,  name: 'South Carolina'},
    { seed: 11, name: 'Oregon'        },
    { seed: 3,  name: 'Baylor'        },
    { seed: 14, name: 'Colgate'       },
    { seed: 7,  name: 'Florida'       },
    { seed: 10, name: 'Colorado'      },
    { seed: 2,  name: 'Tennessee'     },
    { seed: 15, name: "Saint Peter's" },
  ],
  West: [
    { seed: 1,  name: 'Arizona'        },
    { seed: 16, name: 'Long Beach St'  },
    { seed: 8,  name: 'Utah St'        },
    { seed: 9,  name: 'TCU'            },
    { seed: 5,  name: 'Dayton'         },
    { seed: 12, name: 'New Mexico'     },
    { seed: 4,  name: 'Iowa St'        },
    { seed: 13, name: 'S. Dakota St'   },
    { seed: 6,  name: 'Clemson'        },
    { seed: 11, name: 'N. Mexico St'   },
    { seed: 3,  name: 'Illinois'       },
    { seed: 14, name: 'Morehead St'    },
    { seed: 7,  name: 'Nevada'         },
    { seed: 10, name: 'Princeton'      },
    { seed: 2,  name: 'Alabama'        },
    { seed: 15, name: 'Charleston'     },
  ],
  South: [
    { seed: 1,  name: 'Houston'      },
    { seed: 16, name: 'Longwood'     },
    { seed: 8,  name: 'Nebraska'     },
    { seed: 9,  name: 'Texas A&M'    },
    { seed: 5,  name: 'Gonzaga'      },
    { seed: 12, name: 'McNeese St'   },
    { seed: 4,  name: 'Auburn'       },
    { seed: 13, name: 'Yale'         },
    { seed: 6,  name: 'BYU'          },
    { seed: 11, name: 'Duquesne'     },
    { seed: 3,  name: 'Purdue'       },
    { seed: 14, name: 'Akron'        },
    { seed: 7,  name: 'Washington St'},
    { seed: 10, name: 'Furman'       },
    { seed: 2,  name: 'Marquette'    },
    { seed: 15, name: 'Vermont'      },
  ],
  Midwest: [
    { seed: 1,  name: 'Connecticut'    },
    { seed: 16, name: 'Howard'         },
    { seed: 8,  name: 'Northwestern'   },
    { seed: 9,  name: 'Florida Atl'    },
    { seed: 5,  name: 'San Diego St'   },
    { seed: 12, name: 'Grand Canyon'   },
    { seed: 4,  name: 'Indiana'        },
    { seed: 13, name: 'Kent St'        },
    { seed: 6,  name: 'Miami FL'       },
    { seed: 11, name: 'Oral Roberts'   },
    { seed: 3,  name: 'Arkansas'       },
    { seed: 14, name: 'Eastern Wash'   },
    { seed: 7,  name: 'Pittsburgh'     },
    { seed: 10, name: 'Mississippi St' },
    { seed: 2,  name: 'N. Carolina'    },
    { seed: 15, name: 'James Madison'  },
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

function saveState() {
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
    _sender: state.sessionPlayer || state.currentPlayer,
  };
  // Save to server
  fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => {
    console.warn('Save failed, using localStorage fallback:', err);
    showToast('Save failed \u2014 working offline', 'error');
  });
  // Also cache in localStorage as offline fallback
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
  if (saved.defaultPlayersKey !== DEFAULT_PLAYERS_KEY) {
    if (saved.results)      state.results     = saved.results;
    if (saved.currentRound) state.currentRound = saved.currentRound;
    if (saved.roundStatus)  state.roundStatus  = saved.roundStatus;
    if (saved.rulesText !== undefined) state.rulesText = saved.rulesText;
    return;
  }
  if (saved.players?.length)  state.players  = saved.players;
  if (saved.results)          state.results  = saved.results;
  if (saved.picks)            state.picks    = saved.picks;
  if (saved.currentRound)     state.currentRound  = saved.currentRound;
  if (saved.roundStatus)      state.roundStatus   = saved.roundStatus;
  if (saved.rulesText !== undefined) state.rulesText = saved.rulesText;
  if (saved.bonusPicks)   state.bonusPicks   = saved.bonusPicks;
  if (saved.bonusAnswers) state.bonusAnswers = saved.bonusAnswers;
  if (saved.playerPins)   state.playerPins   = saved.playerPins;
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
    const hasPin = !!(state.playerPins[p.id]);
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

function submitPin() {
  const modal = document.getElementById('pin-modal');
  const input = document.getElementById('pin-input');
  const errEl = document.getElementById('pin-error');
  const playerId = modal.dataset.playerId;
  const entered = input.value.trim();
  const correct = state.playerPins[playerId];

  if (entered === correct) {
    modal.style.display = 'none';
    loginAs(playerId);
  } else {
    errEl.style.display = 'block';
    input.value = '';
    input.focus();
  }
}

function closePinModal() {
  document.getElementById('pin-modal').style.display = 'none';
}

function loginAs(pid) {
  state.sessionPlayer   = pid;
  state.currentPlayer   = pid;
  state.adminViewPlayer = null;
  document.getElementById('login-overlay').style.display = 'none';
  updateSessionHeader();
  updatePlayerSelect();
  switchView('bracket');
}

function logoutSession() {
  state.sessionPlayer   = null;
  state.adminViewPlayer = null;
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

function buildMatchup(game) {
  const { t1, t2 } = getTeams(game);
  const winner = getWinner(game.id);
  const playerPick = (state.picks[state.currentPlayer] || {})[game.round]?.[game.id];

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

      row.innerHTML = `
        <span class="t-seed">${team.seed}</span>
        <span class="t-name">${esc(team.name)}</span>`;
    }
    card.appendChild(row);
  });

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

const DEFAULT_RULES_PLACEHOLDER = `Welcome to the pool! Rules will be posted here by the Commissioner.`;

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
  state.pendingPicks = isAdminView ? {} : { ...savedPicks };

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

  const regionLabel = game.label || (game.region ? `${game.region}` : '');
  const hdr = document.createElement('div');
  hdr.className = 'pick-card-hdr';
  hdr.innerHTML = `<span class="pick-card-hdr-label">${esc(regionLabel)}</span>
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

  [t1, t2].forEach(team => {
    if (!team) return;
    const isPicked        = state.pendingPicks[game.id] === team.name;
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
    row.innerHTML = `
      <span class="pick-o-seed">${team.seed}</span>
      <span class="pick-o-name">${esc(team.name)}</span>
      <span class="pick-o-pts">${ptsTxt}</span>
      ${resultMark}`;
    row.insertBefore(radio, row.firstChild);

    if (isOpen) {
      row.addEventListener('click', () => {
        state.pendingPicks[game.id] = team.name;
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

function savePicks() {
  const pid = state.currentPlayer;
  const rid = state.activePicksRound;
  if (!pid) return;
  if (!state.picks[pid]) state.picks[pid] = {};
  state.picks[pid][rid] = { ...state.pendingPicks };
  saveState();
  showToast('Picks saved!', 'success');
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

  // Sort by total score desc
  rows.sort((a, b) => b.total.total - a.total.total);

  const table = document.createElement('table');
  table.className = 'lb-table';

  // Header
  const thead = document.createElement('thead');
  let thHTML = '<tr><th>#</th><th>Player</th>';
  if (state.lbRound === 'all') {
    thHTML += '<th>Score</th><th>Total</th>';
    ROUND_CONFIG.forEach(cfg => { thHTML += `<th class="num">${cfg.short}</th>`; });
  } else {
    thHTML += '<th class="num">Score</th><th class="num">Total</th>';
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

    let tdHTML = `<td class="rank-num ${rankCls}">${rankIcon}</td>
      <td class="${nameClass}">
        <button class="${btnClass}" data-pid="${row.player.id}"${btnTitle}>${esc(row.player.name)}${lockTag}</button>
      </td>`;

    if (state.lbRound === 'all') {
      const maxPossible = row.total.total + row.total.possible;
      const maxScore = ROUND_CONFIG.reduce((sum, cfg) => sum + cfg.pts * getGamesForRound(cfg.id).length, 0);
      const pctW = Math.min(100, Math.round((row.total.total / maxScore) * 100));
      const wl = row.total.correct || row.total.wrong
        ? `<span class="lb-wl"><span class="lb-w">${row.total.correct}✔</span> <span class="lb-l">${row.total.wrong}✘</span></span>`
        : '';
      tdHTML += `<td><span class="lb-total">${fmtScore(row.total.total)}</span>${wl}
          <div class="pct-bar-wrap"><div class="pct-bar" style="width:${pctW}%"></div></div></td>
        <td class="lb-possible">${fmtScore(maxPossible)}</td>`;
      ROUND_CONFIG.forEach(cfg => {
        const s = row.byRound[cfg.id];
        const wlTip = s.correct || s.wrong ? ` title="${s.correct}✔ ${s.wrong}✘"` : '';
        tdHTML += `<td class="lb-round-score num ${s.score === 0 && !s.correct && !s.wrong ? 'zero' : ''}"${wlTip}>${fmtScore(s.score)}</td>`;
      });
    } else {
      const s = row.byRound[state.lbRound];
      const wl = s.correct || s.wrong
        ? `<div class="lb-wl-row"><span class="lb-w">${s.correct} correct</span> <span class="lb-l">${s.wrong} wrong</span></div>`
        : '';
      tdHTML += `<td class="num"><span class="lb-total">${fmtScore(s.score)}</span>${wl}</td>
        <td class="lb-possible num">${fmtScore(s.score + s.possible)}</td>`;
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
  // Upset-heavy bracket for demo variety.
  // Notable Cinderellas: Saint Peter's (15) → E8; Iowa St (4) beats Arizona (1) in S16;
  // Nevada (7) beats Illinois (3) in S16; Marquette (2) beats Houston (1) in E8;
  // Indiana (4) beats Connecticut (1) in S16; multiple 12/11/10/9-seed R64 upsets.
  state.results = {
    // ── EAST ──────────────────────────────────────────────────────
    // R64: Duke(1)✓  Iowa(8)✓  Drake(12)>Wisc(5)  Kansas(4)✓
    //      Oregon(11)>SC(6)  Colgate(14)>Baylor(3)  Florida(7)✓  StPeters(15)>Tenn(2)
    'r64-east-0':'Duke',          'r64-east-1':'Iowa',
    'r64-east-2':'Drake',         'r64-east-3':'Kansas',
    'r64-east-4':'Oregon',        'r64-east-5':'Colgate',
    'r64-east-6':'Florida',       'r64-east-7':"Saint Peter's",
    // R32: Duke>Iowa  Drake>Kansas  Colgate>Oregon  StPeters>Florida
    'r32-east-0':'Duke',          'r32-east-1':'Drake',
    'r32-east-2':'Colgate',       'r32-east-3':"Saint Peter's",
    // S16: Duke>Drake  StPeters>Colgate (15-seed in Elite 8!)
    's16-east-0':'Duke',          's16-east-1':"Saint Peter's",
    // E8: Duke ends the Cinderella run
    'e8-east-0':'Duke',

    // ── WEST ──────────────────────────────────────────────────────
    // R64: Arizona(1)✓  TCU(9)>UtahSt(8)  NewMexico(12)>Dayton(5)  IowaS(4)✓
    //      NMexSt(11)>Clemson(6)  Illinois(3)✓  Nevada(7)✓  Charleston(15)>Alabama(2)
    'r64-west-0':'Arizona',       'r64-west-1':'TCU',
    'r64-west-2':'New Mexico',    'r64-west-3':'Iowa St',
    'r64-west-4':'N. Mexico St',  'r64-west-5':'Illinois',
    'r64-west-6':'Nevada',        'r64-west-7':'Charleston',
    // R32: Arizona>TCU  IowaS>NewMexico  Illinois>NMexSt  Nevada>Charleston
    'r32-west-0':'Arizona',       'r32-west-1':'Iowa St',
    'r32-west-2':'Illinois',      'r32-west-3':'Nevada',
    // S16: IowaS(4)>Arizona(1) UPSET!  Nevada(7)>Illinois(3) UPSET!
    's16-west-0':'Iowa St',       's16-west-1':'Nevada',
    // E8: Iowa St > Nevada
    'e8-west-0':'Iowa St',

    // ── SOUTH ─────────────────────────────────────────────────────
    // R64: Houston(1)✓  TexasAM(9)>Nebraska(8)  McNeese(12)>Gonzaga(5)  Auburn(4)✓
    //      BYU(6)✓  Purdue(3)✓  Furman(10)>WashSt(7)  Marquette(2)✓
    'r64-south-0':'Houston',      'r64-south-1':'Texas A&M',
    'r64-south-2':'McNeese St',   'r64-south-3':'Auburn',
    'r64-south-4':'BYU',          'r64-south-5':'Purdue',
    'r64-south-6':'Furman',       'r64-south-7':'Marquette',
    // R32: Houston>TexasAM  Auburn>McNeese  BYU(6)>Purdue(3) UPSET!  Marquette>Furman
    'r32-south-0':'Houston',      'r32-south-1':'Auburn',
    'r32-south-2':'BYU',          'r32-south-3':'Marquette',
    // S16: Houston>Auburn  Marquette(2)>BYU(6)
    's16-south-0':'Houston',      's16-south-1':'Marquette',
    // E8: Marquette(2)>Houston(1) UPSET!
    'e8-south-0':'Marquette',

    // ── MIDWEST ───────────────────────────────────────────────────
    // R64: UConn(1)✓  FlaAtl(9)>NW(8)  GrandCyn(12)>SanDiego(5)  Indiana(4)✓
    //      OralRob(11)>MiamiFL(6)  Arkansas(3)✓  MissState(10)>Pitt(7)  NCarolina(2)✓
    'r64-midwest-0':'Connecticut', 'r64-midwest-1':'Florida Atl',
    'r64-midwest-2':'Grand Canyon','r64-midwest-3':'Indiana',
    'r64-midwest-4':'Oral Roberts','r64-midwest-5':'Arkansas',
    'r64-midwest-6':'Mississippi St','r64-midwest-7':'N. Carolina',
    // R32: UConn>FlaAtl  Indiana>GrandCyn  Arkansas>OralRob  NCarolina>MissState
    'r32-midwest-0':'Connecticut', 'r32-midwest-1':'Indiana',
    'r32-midwest-2':'Arkansas',    'r32-midwest-3':'N. Carolina',
    // S16: Indiana(4)>UConn(1) UPSET!  NCarolina(2)>Arkansas(3)
    's16-midwest-0':'Indiana',    's16-midwest-1':'N. Carolina',
    // E8: NCarolina(2)>Indiana(4)
    'e8-midwest-0':'N. Carolina',

    // ── FINAL FOUR ────────────────────────────────────────────────
    // F4-0: West(Iowa St,4) vs East(Duke,1) → Duke
    // F4-1: South(Marquette,2) vs Midwest(N.Carolina,2) → Marquette
    'f4-0':'Duke',                'f4-1':'Marquette',
    // Championship: Duke(1) beats Marquette(2)
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
    Object.keys(BONUS_CONFIG).forEach(roundId => {
      BONUS_CONFIG[roundId].forEach(b => {
        if (b.type === 'multi') {
          // e8_teams: auto-populated from player's E8 picks (handled at render time)
          const e8Games = getGamesForRound('e8');
          const e8Picks = (state.picks[player.id] || {})['e8'] || {};
          state.bonusPicks[player.id][b.id] = e8Games.map(g => e8Picks[g.id] || '');
        } else if (b.type === 'select' && b.options) {
          // Pick a random option from the dropdown
          const idx = Math.floor(rng() * b.options.length);
          state.bonusPicks[player.id][b.id] = b.options[idx];
        } else {
          // Free text — leave empty for demo
          state.bonusPicks[player.id][b.id] = '';
        }
      });
    });
  });

  // Also set bonus answers from actual results for multi-type (E8 winners)
  const e8Games = getGamesForRound('e8');
  state.bonusAnswers['e8_teams'] = e8Games.map(g => {
    const w = getWinner(g.id);
    return w ? w.name : '';
  });

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
  renderResultsGrid();
  renderPlayersList();
  renderPinsAdmin();
  renderBonusAdmin();
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

function savePins() {
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
  saveState();
  showToast('PINs saved!', 'success');
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

  // Seed default players if none
  if (!state.players.length) {
    state.players = DEFAULT_PLAYERS.map(p => ({ ...p, id: uid() }));
    saveState();
  }
  if (!state.currentPlayer && state.players.length) {
    state.currentPlayer = state.players[0].id;
  }

  setupEvents();
  renderLoginOverlay();
  startPolling();
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
    playerPins: state.playerPins,
  });

  pollTimer = setInterval(pollServer, 8000);

  // Pause polling when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(pollTimer);
      pollTimer = null;
    } else {
      pollServer(); // immediate refresh on return
      pollTimer = setInterval(pollServer, 8000);
    }
  });
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

    // Apply server state without clobbering local UI state
    applyLoadedState(saved);
    renderCurrentView();
  } catch (e) {
    // silently ignore poll errors
  }
}

document.addEventListener('DOMContentLoaded', init);
