const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db', 'microbio.db');
const initSQL = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');

const db = new sqlite3.Database(dbPath);

// init
db.serialize(() => {
  db.exec(initSQL);
  const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'seed.json'), 'utf8'));
  const stmt = db.prepare(`INSERT INTO bacteria (name, gram, tsi, citrato, indol, sim, fenilalanina) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  seed.forEach(b => {
    stmt.run(b.name, b.gram, b.tsi, b.citrato, b.indol, b.sim, b.fenilalanina);
  });
  stmt.finalize();
});

app.get('/api/bacteria', (req, res) => {
  db.all('SELECT * FROM bacteria', (err, rows) => { if (err) return res.status(500).json({error:err.message}); res.json(rows); });
});

app.post('/api/match', (req, res) => {
  const tests = req.body || {};
  db.all('SELECT * FROM bacteria', (err, rows) => {
    if (err) return res.status(500).json({error:err.message});
    const result = rows.map(b => {
      let score = 0;
      for (const key of Object.keys(tests)) {
        if (tests[key] && b[key] && b[key].toLowerCase().includes(String(tests[key]).toLowerCase())) score++;
      }
      return { bacteria: b.name, score };
    });
    result.sort((a,b)=>b.score-a.score);
    res.json(result);
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('API rodando na porta', port));
