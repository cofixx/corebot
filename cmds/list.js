const crypto = require('crypto');

function getuuid(user) {
  const input = 'OfflinePlayer:' + user;
  const hashBuffer = crypto.createHash('md5').update(input).digest();

  // Set version to 3 (UUID v3)
  hashBuffer[6] = (hashBuffer[6] & 0x0f) | 0x30;

  // Set variant to RFC 4122
  hashBuffer[8] = (hashBuffer[8] & 0x3f) | 0x80;

  const hash = hashBuffer.toString('hex');
  const uuid1 = [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32)
  ].join('-');
  return uuid1
}

module.exports = {
  name: 'list',
  permission: 'PUBLIC',
  aliases: [],
  description: "List all users",

  run: (bot, username, uuid, args) => {
    const users = Object.values(bot.users);

    if (users.length === 0) {
      return bot.core.run(`tellraw @a {"text":"[ȼBot] No players are currently online.","color":"red"}`);
    }

    const message = {
      text: "",
      extra: [
        { text: "[", color: "dark_gray" },
        { text: "ȼBot", color: "#2dfc65" },
        { text: "] ", color: "dark_gray" },
        { text: "List of all Players\n", color: "#61f272" }
      ]
    };

    for (const user of users) {
      const uuid = getuuid(user);
      message.extra.push(
        { text: `${user} - (`, color: "white" },
        {
          text: "UUID",
          color: "aqua",
          hoverEvent: {
            action: "show_text",
            contents: { text: `Click to copy UUID\n${uuid}`, color: "yellow" }
          },
          clickEvent: {
            action: "copy_to_clipboard",
            value: uuid
          }
        },
        { text: ")\n", color: "white" }
      );
    }

    bot.core.run(`tellraw @a ${JSON.stringify(message)}`);
  }
};
