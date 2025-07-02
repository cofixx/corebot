const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Failed to open DB:', err);
  else console.log('Database connected!');
});

// Assign to bot.db externally, for example:
// bot.db = db;

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS logins (
    uuid TEXT,
    username TEXT,
    ip TEXT,
    server TEXT
  )`);
});

function removeDuplicates() {
  db.serialize(() => {
    db.run(`
      DELETE FROM logins
      WHERE rowid NOT IN (
        SELECT MIN(rowid)
        FROM logins
        GROUP BY uuid, username, ip, server
      )
    `, (err) => {
      if (err) {
        console.error('Failed to remove duplicates:', err);
      } else {
        console.log('Duplicate rows removed from logins table.');
      }
    });
  });
}

function logPlayer(bot, uuid, username, ip, server) {
  db.get(
    `SELECT 1 FROM logins WHERE uuid = ? AND username = ? AND ip = ? AND server = ?`,
    [uuid, username, ip, server],
    (err, row) => {
      if (err) return console.error('DB Error (check):', err);

      if (!row) {
        // If no such record exists, insert it
        db.run(
          `INSERT INTO logins (uuid, username, ip, server) VALUES (?, ?, ?, ?)`,
          [uuid, username, ip, server],
          (err) => {
            if (err) return console.error('DB Error (insert):', err);
          }
        );
      }

      // Always update bot.usersip, even if DB insert skipped
      bot.usersip[username] = { ip, name: username };
    }
  );
}

function loadUsersIp(bot, callback) {
  db.all(`SELECT username, ip FROM logins`, (err, rows) => {
    if (err) {
      console.error('Failed to load users IPs:', err);
      return callback(err);
    }
    callback(null);
  });
}

function getAlts(bot, username, callback) {
  const userData = bot.usersip[username];
  if (!userData || !userData.ip) return callback(null, []);

  db.all(
    `SELECT DISTINCT username FROM logins WHERE ip = ? AND username != ?`,
    [userData.ip, username],
    (err, rows) => {
      if (err) return callback(err);
      const alts = rows.map(r => r.username);
      callback(null, alts);
    }
  );
}

module.exports = { logPlayer, getAlts, loadUsersIp, removeDuplicates, db };
