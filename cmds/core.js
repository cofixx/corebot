var core = require('../core.js')
module.exports = {
  name: "core",
  permission: 'PUBLIC',
  aliases: ['cb'],
  description: "Make the bot run a cmd using core",
  
  run: (bot, username, uuid, args) => {
    switch (args[0]) {
      case "run": {
        bot.core.run(args.slice(1).join(' '))
        break;
      }

      case "refill": {
        bot.core.refill()
        break;
      }

      case "tracked": {
        const commandArgs = args.slice(1).join(' ');
        bot.core.runt(commandArgs, "public");
        break;
      }

      case "move": {
        setTimeout(() => {
          delete bot.core
          bot.core = new core({x: bot.entity.position.x, y: bot.entity.position.y, z: bot.entity.position.z }, {x: bot.entity.position.x+15, y: bot.entity.position.y, z: bot.entity.position.z+15 }, bot)
          bot.core.run(' ')
          bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Core moved!`, color: "#61f272"}]})}`)
        
        }, 200)
        break;
      }

      default: {
        bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid usage! Usage: ${bot.prefix}core <move/refill/run/tracked> [cmd]`, color: "#db1c02"}]})}`)
        break;
      }
    }
  }
}
