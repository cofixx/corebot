require('dotenv').config();
const { generateHash } = require('./../hash.js')
module.exports = {
  name: 'kick',
  permission: 'TRUST',
  aliases: ['k'],
  description: "Attempts to kick players",
  
  run: (bot, username, uuid, args) => {
    if (args[0] === bot.hash.trust) {
      bot.hash.trust = generateHash(process.env['trustkey']);
      bot.exploits.kick(args[1])
      bot.core.run(`tellraw @a ${JSON.stringify({
        translate: "[%s] %s %s",
        color: "dark_gray",
        with: [
          { text: `ȼBot`, color: "#2dfc65" },
          { text: `Attempting to kick`, color: "#61f272" },
          { text: `${args[1]}`, color: "white" },
        ]
      })}`)
    } else {
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid hash!`, color: "#db1c02"}]})}`)
    }
  }
}
