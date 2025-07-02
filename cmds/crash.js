require('dotenv').config();
const { generateHash } = require('./../hash.js')
module.exports = {
  name: 'crash',
  permission: 'TRUST',
  aliases: ['c'],
  description: "Attempt to crash players",
  
  run: (bot, username, uuid, args) => {
    if (args[0] === bot.hash.trust) {
      bot.hash.trust=generateHash(process.env['trustkey'])
      bot.core.run(`tellraw @a ${JSON.stringify({
        translate: "[%s] %s %s",
        color: "dark_gray",
        with: [
          { text: `ȼBot`, color: "#2dfc65" },
          { text: `Attempting to crash`, color: "#61f272" },
          { text: `${args[1]}`, color: "white" },
        ]
      })}`)
      bot.exploits.crash(args[1])
    } else {
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid hash!`, color: "#db1c02"}]})}`)
    }
  }
}
