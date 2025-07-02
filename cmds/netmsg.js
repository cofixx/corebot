module.exports = {
  name: 'netmsg',
  permission: 'PUBLIC',
  aliases: ['nm'],
  description: 'Message people between different servers',

  run(bot, username, uuid, args) {
    if (!args.length) return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid usage! Usage: ${bot.prefix}netmsg <message>`, color: "#db1c02"}]})}`)

    for (const _ of Object.values(bot.bots)) {
      if (!_?.server?.name) continue;

      if (_.server.name === bot.server.name) continue;

      _.core.run(`tellraw @a ${JSON.stringify(
        {translate: "[%s] %s", color: "dark_gray", with:[
            {text: `ȼBot`, color: "#2dfc65"},
            {text: `[${bot.server.name}] ${username}: ${args.join(' ')}`, color: "#61f272"}
          ]
        }
      )}`);
      bot.core.run(`tellraw @a ${JSON.stringify(
        {translate: "[%s] %s", color: "dark_gray", with:[
            {text: `ȼBot`, color: "#2dfc65"},
            {text: `[${bot.server.name}] ${username}: ${args.join(' ')}`, color: "#61f272"}
          ]
        }
      )}`)

    }
  }
}
