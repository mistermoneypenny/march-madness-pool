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

app.listen(PORT, () => {
  console.log(`March Madness Pool running at http://localhost:${PORT}`);
});
