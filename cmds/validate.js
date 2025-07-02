require('dotenv').config();
const { generateHash } = require('./../hash.js')
module.exports = {
  name: 'validate',
  permission: 'TRUST',
  aliases: ['val', 'hash'],
  description: "Tests and validates a hash",
  
  run: (bot, username, uuid, args) => {
    if (args[0] === bot.hash.trust) {
      bot.hash.trust=generateHash(process.env['trustkey']);
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Valid hash with level:`, color: "#61f272"},{text: `TRUST`, color: "#ffc400"}]})}`)
    } else if (args[0] === bot.hash.admin) {
      bot.hash.admin=generateHash(process.env['adminkey']); 
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Valid hash with level:`, color: "#61f272"},{text: `ADMIN`, color: "#d96252"}]})}`)
    } else if (args[0] === bot.hash.owner) { 
      bot.hash.owner=generateHash(process.env['ownerkey']); 
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Valid hash with level:`, color: "#61f272"},{text: `OWNER`, color: "#cc0000"}]})}`)
    } else {
      bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid hash!`, color: "#db1c02"}]})}`)
    }
  }
}
