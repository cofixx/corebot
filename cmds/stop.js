require('dotenv').config();
const { generateHash } = require('./../hash.js')
module.exports = {
  name: 'stop',
  permission: 'OWNER',
  aliases: [],
  description: "Short circuts the bot",
  
  run: (bot, username, uuid, args) => {
    if (args[0] === bot.hash.owner) {
      bot.hash.owner = generateHash(process.env['ownerkey']);
      process.exit(1)
    } else {
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid hash!`, color: "#db1c02"}]})}`)
    }
  }
}
