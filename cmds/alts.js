const { getAlts } = require('../database.js');

module.exports = {
  name: 'alts',
  permission: 'PUBLIC',
  aliases: [],
  description: "Shows other usernames that used the same IP on this server",

  run: (bot, username, uuid, args) => {
    const target = args[0] || username;
    const serverName = bot.server.name;

    // Get the latest IP for the target on the current server
    bot.db.get(
      'SELECT ip FROM logins WHERE username = ? AND server = ? ORDER BY rowid DESC LIMIT 1',
      [target, serverName],
      (err, row) => {
        if (err) {
          return bot.core.run(`tellraw @a {"text":"Error querying database for ${target}","color":"red"}`);
        }
        if (!row || !row.ip) {
          return bot.core.run(`tellraw @a {"text":"No IP data for ${target} on this server","color":"yellow"}`);
        }

        // Find distinct usernames on the same IP and same server, excluding the target username
        bot.db.all(
          'SELECT DISTINCT username FROM logins WHERE ip = ? AND username != ? AND server = ?',
          [row.ip, target, serverName],
          (err, rows) => {
            if (err) {
              return bot.core.run(`tellraw @a {"text":"Error fetching alts for ${target}","color":"red"}`);
            }
            if (rows.length === 0) {
              return bot.core.run(`tellraw @a {"text":"${target} has no known alts on this server.","color":"yellow"}`);
            }

            const alts = rows.map(r => r.username);

            bot.core.run(`tellraw @a ${JSON.stringify({
              translate: "[%s] %s\n %s",
              color: "dark_gray",
              with: [
                { text: `ȼBot`, color: "#2dfc65" },
                { text: `Alts for ${target} (may not be correct)`, color: "#61f272" },
                { text: alts.join(', '), color: "white" }
              ]
            })}`);
          }
        );
      }
    );
  }
};
