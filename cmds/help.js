const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname);
const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

module.exports = {
  name: 'help',
  permission: 'PUBLIC',
  aliases: ['h'],
  description: 'Displays available commands',

  run: (bot, username, uuid, args) => {
    const commands = [];

    for (const file of commandFiles) {
      const cmd = require(path.join(commandsDir, file));
      commands.push({
        name: cmd.name || file.replace('.js', ''),
        aliases: cmd.aliases || [],
        description: cmd.description || 'No description',
        permission: cmd.permission || 'PUBLIC'
      });
    }

    if (args.length > 0) {
      const input = args[0].toLowerCase();
      const cmd = commands.find(c => c.name === input || c.aliases.includes(input));

      if (!cmd) {
        bot.chat(`&cNo command found for "${input}"`);
        return;
      }
      const permColors = {
        PUBLIC: "#00ff40",
        TRUST: "#ffc400",
        ADMIN: "#d96252",
        OWNER: "#cc0000"
      };
      const perm = cmd.permission;
      const permColor = permColors[perm] || "#000000";

      bot.core.run(`tellraw @a ${JSON.stringify({
        translate: "[%s] %s\n %s %s\n %s %s\n %s %s\n %s %s",
        color: "dark_gray",
        with: [
          { text: `ȼBot`, color: "#2dfc65" },
          { text: "Command Info", color: "#0be6a8" },
          { text: `Name:`, color: "#03fca1" },
          { text: `${cmd.name}`, color: "#1cfc03" },
          { text: "Aliases:", color: "#03fca1" },
          { text: `${cmd.aliases.join(', ') || '*none*'}`, color: "#1cfc03" },
          { text: "Description:", color: "#03fca1" },
          { text: `${cmd.description}`, color: "#1cfc03" },
          { text: "Permission:", color: "#03fca1" },
          { text: `${perm}`, color: permColor }
        ]
      })}`);
    } else {
      const publicCmds = commands.filter(c => c.permission === 'PUBLIC').map(c => c.name).join(' ');
      const trustedCmds = commands.filter(c => c.permission === 'TRUST').map(c => c.name).join(' ');
      const adminCmds = commands.filter(c => c.permission === 'ADMIN').map(c => c.name).join(' ');
      const ownerCmds = commands.filter(c => c.permission === 'OWNER').map(c => c.name).join(' ');

      bot.core.run(`tellraw @a ${JSON.stringify({
        translate: "[%s] %s (%s) - < %s %s %s %s >\n %s %s %s %s", color: "dark_gray", with: [
          { text: `ȼBot`, color: "#2dfc65" },
          { text: "Commands", color: "#0be6a8" },
          { text: `${commands.length}`, color: "#07f5d1" },

          { text: "Public", color: "#00ff40" },
          { text: "Trusted", color: "#ffc400" },
          { text: "Admin", color: "#d96252" },
          { text: "Owner", color: "#cc0000" },

          { text: publicCmds || 'null', color: "#00ff40" },
          { text: trustedCmds || 'null', color: "#ffc400" },
          { text: adminCmds || 'null', color: "#d96252" },
          { text: ownerCmds || 'null', color: "#cc0000" }
        ]
      })}`);
    }
  }
}
