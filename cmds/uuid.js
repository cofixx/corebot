const crypto = require('crypto');
const https = require('https');

module.exports = {
  name: 'uuid',
  permission: 'PUBLIC',
  aliases: ['uuidgen'],
  description: 'Generate and get player uuid',

  run: (bot, username, uuid, args) => {
    const user = args[0];
    if (!user) {
      return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Usage: ${bot.prefix}uuid <user>`, color: "#00ffae"}]})}`)
    }
    
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

    const url = `https://api.mojang.com/users/profiles/minecraft/${user}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let text2;

        try {
          const profile = JSON.parse(data);
          if (profile && profile.id) {
            const uuid2 = [profile.id.substring(0, 8),profile.id.substring(8, 12),profile.id.substring(12, 16),profile.id.substring(16, 20),profile.id.substring(20)].join('-');

            text2 = [
              { text: `Online: ${user} - (`, color: "white" },
              {
                text: uuid2,
                color: "white",
                hoverEvent: { action: "show_text", value: "Click to copy Online UUID" },
                clickEvent: { action: "copy_to_clipboard", value: uuid2 }
              },
              { text: `)\n`, color: "white" }
            ];
          } else {
            text2 = [
              { text: `Online: ${user} - (Not Found)\n`, color: "red" }
            ];
          }
        } catch {
          text2 = [
            { text: `Online: ${user} - (Error)\n`, color: "red" }
          ];
        }

        const text1 = [
          { text: `Offline: ${user} - (`, color: "white" },
          {
            text: uuid1,
            color: "white",
            hoverEvent: { action: "show_text", value: "Click to copy Offline UUID" },
            clickEvent: { action: "copy_to_clipboard", value: uuid1 }
          },
          { text: `)`, color: "white" }
        ];

        const combinedText = [...text2, " ", ...text1];

        bot.core.run(`tellraw @a ${JSON.stringify({
          translate: "[%s] %s\n %s",
          color: "dark_gray",
          with: [
            { text: "ȼBot", color: "#2dfc65" },
            { text: "UUID Generator", color: "#61f272" },
            { text: "", extra: combinedText }
          ]
        })}`);
      });
    }).on('error', () => {
      bot.chat(`failed to fetch uuid`);
    });
  }
};
