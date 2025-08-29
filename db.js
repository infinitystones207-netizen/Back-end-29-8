// db.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data.sqlite");

// Create leads table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = {
  getLeads: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM leads ORDER BY created_at DESC", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  addLead: (name, phone, email) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO leads (name, phone, email) VALUES (?, ?, ?)",
        [name, phone, email],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, phone, email });
        }
      );
    });
  },
};
