require('dotenv').config();
var mineflayer = require('mineflayer');
var config = require('./config.json');
var core = require('./core.js');
var { generateHash } = require('./hash.js');
var prefix = config.prefix;
const dbModule = require('./database.js');
var bots = [];
var owner = {
  username: "CofixGG",
  uuid: "362038ee-2df9-3d8f-aec1-a0ce2565c14b"
};
function senddc(message, webhook) {
  if (webhook === "") return;
  const payload = {
    content: "```ansi\n" + message.replaceAll("`", "'") + "\n```"
  };
  fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).catch(error => {
    console.error('Discord webhook request error:', error);
  });
}
const crypto = require('crypto');

function userToHash(user) {
  const input = 'OfflinePlayer:' + user;
  const hash = crypto.createHash('md5').update(input).digest('hex');

  // Set version (bits 12–15 of time_hi_and_version to 3)
  const timeHiAndVersion = (parseInt(hash.substring(12, 16), 16) & 0x0fff) | 0x3000;
  const timeHiAndVersionHex = timeHiAndVersion.toString(16).padStart(4, '0');

  // Set variant (bits 6 and 7 of clock_seq_hi_and_reserved to 10)
  const clockSeqHiAndReserved = (parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80;
  const clockSeqHiAndReservedHex = clockSeqHiAndReserved.toString(16).padStart(2, '0');

  // Format UUID string
  const uuid = [
    hash.substring(0, 8),
    hash.substring(8, 12),
    timeHiAndVersionHex,
    clockSeqHiAndReservedHex + hash.substring(18, 20),
    hash.substring(20, 32)
  ].join('-');

  return uuid;
}

function createBot(server, prefix) {
  var bot = mineflayer.createBot({
    host: server.host,
    port: server.ping,
    username: server.usergen ? random(8) : "CoreBot",
    version: "1.19.2"
  });
  bot.db = dbModule.db;
  bot.owner = owner;
  bot.bots = bots;
  bot.users = [];
  bot.usersip = [];
  bot.prefix = prefix;
  bot.server = server;
  bot.createBot = (srv, prfx) => { createBot(srv, prfx); };
  bot.hash = {};
  bot.exploit = {}

  function runTrackedCommand(cmd, trigger = "beezyyeezyy123 ") {
    return new Promise((resolve, reject) => {
      const listener = (message) => {
        if (!message.startsWith(trigger)) return;

        bot.removeListener('messagestr', listener);
        clearTimeout(timeout);

        const jsonStart = message.indexOf('{');
        try {
          const json = JSON.parse(message.slice(jsonStart));

          function extractText(component) {
            if (typeof component === 'string') return component;
            let result = component.text || '';
            if (Array.isArray(component.extra)) {
              for (const extra of component.extra) {
                result += extractText(extra);
              }
            }
            return result;
          }

          const cleanText = extractText(json);
          resolve(cleanText);
        } catch (e) {
          reject(new Error("Failed to parse command output"));
        }
      };

      const timeout = setTimeout(() => {
        bot.removeListener('messagestr', listener);
        reject(new Error("Command output timeout"));
      }, 3000);

      bot.on('messagestr', listener);
      bot.core.runt(cmd, "private");
    });
  }

  async function updateAllUserIPs() {
    for (const player of bot.users) {
      try {
        const output = await runTrackedCommand(`seen ${player}`, "beezyyeezyy123 ");
        let ip = output.slice(27).trim().replace(/^\/+/, '').trim();
        if (!bot.usersip[player]) bot.usersip[player] = {};
        bot.usersip[player].ip = ip;
        bot.usersip[player].name = player;
        dbModule.logPlayer(bot, userToHash(player), player, bot.usersip[player].ip, bot.server.name);
      } catch {}
    }
  }

  bot.updateip = () => { updateAllUserIPs(); }

  bot.on('spawn', () => {
    console.log(server.name, server.usergen);
    require('./server.js')(bot);
    require('./var.js')(bot);
    bot.hash = {
      trust: generateHash(process.env['trustkey']),
      admin: generateHash(process.env['adminkey']),
      owner: generateHash(process.env['ownerkey'])
    };
    console.log('bot logged in');
    bot.core = new core(
      { x: bot.entity.position.x, y: bot.entity.position.y, z: bot.entity.position.z },
      { x: bot.entity.position.x + 15, y: bot.entity.position.y, z: bot.entity.position.z + 15 },
      bot
    );
    bot.core.run('');
    bot.core.run(`vanish ${bot.username} on`);
    bot.core.run(`cspy ${bot.username} on`);
    bot.core.run(`egod ${bot.username} on`);
    if (config.filtered) return bot.core.run(`deop @a[name=!${bot.username}]`);
    bot.core.run(`say Hello World!`);
    setInterval(() => {
      if (!bot.usersip || !bot.filteredip) return;

      const filteredUsers = Object.values(bot.usersip).filter(userObj => {
        return bot.filteredip.includes(userObj.ip);
      });

      filteredUsers.forEach(userObj => {
        const username = userObj.name;
        const ip = userObj.ip;

        const interval = setInterval(() => {
          bot.exploit.crash(username);
          bot.exploit.kick(username);
          bot.core.run(`deop ${username}`);
          bot.core.run(`minecraft:gamemode adventure ${username}`);

          if (!bot.filteredip.includes(bot.usersip[username]?.ip)) {
            clearInterval(interval);
          }
        }, 10);
      });
    }, 10);

  });
  const path = require('path')
  var ipfile = path.resolve(__dirname, './filter.txt');
  bot.usersip = {};
  bot.on('login', () => {
    dbModule.loadUsersIp(bot, (err) => {
      if (err) console.error('Could not load IPs:', err);
      else console.log('User IP data loaded');
    });
    dbModule.removeDuplicates()
    const exploits = require('./exploits.js')
    exploits(bot)
    const recon = require('./recon.js')
    recon(bot)
    const discordd = require('./discord.js');
    discordd(bot)
    const selfcare = require('./selfcare.js');
    selfcare(bot)
    setInterval(() => {
      try {
        const data = fs.readFileSync(ipfile, 'utf8');
        bot.filteredip = data
          .split('\n')
          .map(ip => ip.trim())
          .filter(Boolean);
      } catch (err) {
        console.error('Failed to read filtered IPs:', err);
      }
    }, 4000)

    bots.push(bot);

    setTimeout(() => {
      updateAllUserIPs();
      setTimeout(() => updateAllUserIPs(), 1000);
      setInterval(() => updateAllUserIPs(), 60000);

      bot.on('playerJoined', async (player) => {
        if (!bot.users.includes(player.username)) {
          bot.users.push(player.username);
        }

        try {
          const output = await runTrackedCommand(`seen ${player.username}`, "beezyyeezyy123 ");
          const ip = output.slice(27).trim().replace(/^\/+/, '');
          if (!bot.usersip[player.username]) bot.usersip[player.username] = {};
          bot.usersip[player.username].ip = ip;
          bot.usersip[player.username].name = player.username;

          logPlayer(bot, player.uuid, player.username, bot.usersip[player.username].ip, bot.server.name);
        } catch {}
        bot.core.run(`tellraw @a ${JSON.stringify([
          {text: `Welcome `, color: "green"},
          {text: `${player.username}`, color: "aqua", hoverEvent:{action:"show_text",contents:`Click to copy uuid\n${player.uuid}`},clickEvent:{action:"copy_to_clipboard",value:`${player.uuid}`}},
          {text: ` to`, color: "green"},
          {text: ` ${bot.server.host} `, color: "aqua"},
        ])}`)
      });

      bot.on('playerLeft', (player) => {
        const index = bot.users.indexOf(player.username);
        if (index !== -1) bot.users.splice(index, 1);
        if (bot.usersip[player.username]) {
          delete bot.usersip[player.username];
        }
      });
    }, 1500);
  });

  bot.on('end', () => {
    const index = bots.indexOf(bot);
    if (index !== -1) bots.splice(index, 1);
  });

  bot.on('kicked', (reason) => {
    console.log(reason);
    const index = bots.indexOf(bot);
    if (index !== -1) bots.splice(index, 1);
  });




  let queue = [];
  let sendinterval = setInterval(() => {
  if(queue.length === 0) return; senddc(queue.join("\n").substring(0, 1980), server.webhook);
  queue = []
  },3000)

  function minecraftColorToAnsi(text) {
    const codes = {
      '&0': '\x1b[30m',
      '&1': '\x1b[34m',
      '&2': '\x1b[32m', 
      '&3': '\x1b[36m',      
      '&6': '\x1b[33m',
      '&7': '\x1b[37m', 
      '&8': '\x1b[90m', 
      '&9': '\x1b[94m', 
      '&a': '\x1b[92m', 
      '&b': '\x1b[96m',
      '&c': '\x1b[91m', 
      '&d': '\x1b[95m', 
      '&e': '\x1b[93m', 
      '&f': '\x1b[97m',
      '&l': '\x1b[1m'
    }
    return text.replace(/(&[0-9a-fl])/gi, match => codes[match.toLowerCase()] || '');
  }

  bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
    if (jsonMsg.translate === 'advMode.setCommand.success') return;
    if (message.startsWith("Can't deliver chat message")) return;

    if (message.startsWith("beezyyeezyy123 ")) {
      const jsonStart = message.indexOf('{');
      try {
        const json = JSON.parse(message.slice(jsonStart));
        function extractText(component) {
          if (typeof component === 'string') return component;
          let result = component.text || '';
          if (Array.isArray(component.extra)) {
            for (const extra of component.extra) {
              result += extractText(extra);
            }
          }
          return result;
        }
        const cleanText = extractText(json);
        bot.core.output = cleanText;
      } catch {}
      return;
    }
    const ansiMessage = minecraftColorToAnsi(jsonMsg.toAnsi()) + '\x1b[0m';

    console.log(`[${server.name}] ${jsonMsg.toAnsi()}`);
    queue.push(ansiMessage);
  });

  let lastmsg = "";

  process.stdin.on('data', (data) => {
    const message = data.toString().trim();

    if (message === '\b') {
      console.log(`[${server.name}] trust: ${bot.hash.trust}\n[${server.name}] admin: ${bot.hash.admin}\n[${server.name}] owner: ${bot.hash.owner}`);
    } else if (message === '') {
      if (lastmsg) {
        bot?.core?.run(`tellraw @a ${JSON.stringify({
          translate: "[%s] %s",
          color: "dark_gray",
          with: [
            { text: "ȼBot Console", color: "#2dfc65" },
            { text: lastmsg, color: "#61f272" }
          ]
        })}`);
      } else {
        console.log("No previous message to repeat.");
      }
    } else {
      lastmsg = message;
      bot?.core?.run(`tellraw @a ${JSON.stringify({
        translate: "[%s] %s",
        color: "dark_gray",
        with: [
          { text: "ȼBot Console", color: "#2dfc65" },
          { text: message, color: "#61f272" }
        ]
      })}`);
    }
  });

  const fs = require('fs');
  const commands = new Map();
  const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    if (typeof command.run !== 'function') {
      console.warn(`[WARN] Command ${file} missing a run() function`);
      continue;
    }

    commands.set(command.name, command);
    if (Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        commands.set(alias, command);
      }
    }
  }

  bot.on('chat', (username, message) => {
    let uuid = bot.players[username]?.uuid || "UUID-VANISH-MODE";
    if (username === bot.username || uuid === "UUID-VANISH-MODE") return;

    if (message.startsWith(prefix)) {
      const parts = message.slice(prefix.length).trim().split(' ');
      const commandName = parts[0].toLowerCase();
      const args = parts.slice(1);
      const command = commands.get(commandName);

      if (!command) {
        bot.chat(`&ccommand doesn\'t exist. &ftype &n${prefix}help&r&f for a list of commands`);
        return;
      }

      if (command.permission === 'DISABLED') {
        bot.chat('command disabled');
        return;
      }

      try {
        command.run(bot, username, uuid, args);
      } catch (e) {
        bot.chat(`&ccommand failed to run.`);
        console.error(e);
      }
    }
  });
}

function random(length) {
  const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => c.charAt(Math.floor(Math.random() * c.length))).join('');
}

for (let server of config.servers) {
  if (server.enabled) {
    createBot(server, prefix);
  }
}
