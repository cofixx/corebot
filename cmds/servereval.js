require('dotenv').config();
const { generateHash } = require('../hash.js')
module.exports = {
  name: 'servereval',
  permission: 'OWNER',
  aliases: [],
  description: "Attempts to kick players",
  
  run: (bot, username, uuid, args) => {
    if (args[0] === bot.hash.owner) {
      bot.hash.owner = generateHash(process.env['ownerkey']);
        try {
            bot.core.run(`tellraw @a ${JSON.stringify({
                translate: "[%s] %s\n %s",
                color: "dark_gray",
                with: [
                { text: `ȼBot`, color: "#2dfc65" },
                { text: `Output`, color: "#61f272" },
                { text: `${eval(args.slice(1).join(' '))}`, color: "white" },
                ]
            })}`)
        } catch (e) {
            bot.core.run(`tellraw @a ${JSON.stringify({
                translate: "[%s] %s\n %s",
                color: "dark_gray",
                with: [
                { text: `ȼBot`, color: "#2dfc65" },
                { text: `Error:`, color: "#db1c02" },
                { text: `${e}`, color: "white" },
                ]
            })}`)
        }
    } else {
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid hash!`, color: "#db1c02"}]})}`)
    }
  }
}
