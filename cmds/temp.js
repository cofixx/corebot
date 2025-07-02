const os = require("os");
const core = require('../core.js')
const { logPlayer, getAlts, loadUsersIp } = require('../database.js')
module.exports = {
  name: "temp",
  permission: 'PUBLIC',
  aliases: [],
  description: "Random stuff so I don't make useless cmds",

  run: (bot, username, uuid, args) => {
    const _ = args[0]?.toLowerCase(); // lowercase for safer matching
    const stuff = ["usages", "disablegmc", "ip"]
    switch (_) {
      case "usages": {
        const freemem = (os.freemem() / 1024 / 1024).toFixed(2) + ' MB';
        const botmem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB';

        const cpus = os.cpus();
        const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
        const total = cpus.reduce((acc, cpu) =>
          acc + Object.values(cpu.times).reduce((a, b) => a + b, 0), 0);
        const cpuUsage = ((1 - idle / total) * 100).toFixed(2) + ' %';

        bot.core.run(`tellraw @a ${JSON.stringify({
          translate: "[%s] %s\n %s\n %s\n %s",
          color: "dark_gray",
          with: [
            { text: `ȼBot`, color: "#2dfc65" },
            { text: `Bot Usages`, color: "#61f272" },
            { text: `Free Memory: ${freemem}`, color: "white" },
            { text: `Bot Memory: ${botmem}`, color: "white" },
            { text: `CPU Usage: ${cpuUsage}`, color: "white" },
          ]
        })}`);
        break;
      }

      case 'disablegmc': {
        const user = args[1]
        const jailname = random(100)
        bot.core.run(`sudo ${user} essentials:createjail ${jailname}`)
        setTimeout(() => {
          bot.core.run(`minecraft:gamemode adventure ${user}`)
          bot.core.run(`essentials:jail ${user} ${jailname} 10y`)
          bot.core.run(`essentials:god ${user} off`)
          bot.core.run(`essentials:fly ${user} off`)
          bot.core.run(`minecraft:tellraw ${user} "\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\nwow, i just disabled you privleges for switching gamemodes."`)
        }, 200)
        break;
      }
      case 'database': {

        loadUsersIp(bot, (err) => {
          if (err) {
            return console.error('Failed to load IP data');
          }
          bot.chat(`yup, loaded!`)
        });
        break
      }
      case 'ip': {
        if (args[1]) {
          var user = args[1]
          bot.core.run(`say ${bot.usersip[user].name} - ${bot.usersip[user].ip}`)
        } else {
          const users = Object.values(bot.usersip);
          if (users.length === 0) {
            bot.core.run(`say i cant find ips`);
          } else {
            for (const user of users) {
              bot.core.run(`say ${user.name} - ${user.ip}`);
            }
          }
          break;
        }
      }


      default: {
        if (args[1]) return
        bot.chat("list: " + stuff.join(', '));
        break;
      }
    }
  }
}

function random(length) {
  const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => c.charAt(Math.floor(Math.random() * c.length))).join('');
}
