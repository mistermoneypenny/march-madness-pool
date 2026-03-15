const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'state.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

// ── GET /api/state ──────────────────────────────────────────
app.get('/api/state', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) return res.json({});
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = raw.trim() ? JSON.parse(raw) : {};
    res.json(data);
  } catch (e) {
    console.error('GET /api/state error:', e.message);
    res.json({});
  }
});

// ── POST /api/state ─────────────────────────────────────────
// Smart merge: admin fields overwrite, picks merge per-player
app.post('/api/state', (req, res) => {
  try {
    // Read existing state
    let existing = {};
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      if (raw.trim()) existing = JSON.parse(raw);
    }

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

    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /api/state error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`March Madness Pool running at http://localhost:${PORT}`);
});
