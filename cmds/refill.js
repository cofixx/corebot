module.exports = {
  name: 'refill',
  permission: 'PUBLIC',
  aliases: ['rc'],
  description: "Reloads command core",
  
  run: (bot, username, uuid, args) => {
    bot.core.refill();
    bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Refilled core!`, color: "#61f272"}]})}`)
  }
}

