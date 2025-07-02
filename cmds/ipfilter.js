module.exports = {
    name: 'ipfilter',
    permission: 'ADMIN',
    aliases: ['ipf', 'filterip'],
    description: 'Filter a players ip',

    run(bot, username, uuid, args) {
        if (args.length < 1) {
            return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid usage! Usage: ${bot.prefix}ipfilter <hash> <add/list/remove> [user]`, color: "#db1c02"}]})}`)
        }

        const fs = require('fs');
        const path = require('path');

        var { generateHash } = require('../hash.js');
        const filterFilePath = path.resolve(__dirname, '../filter.txt');


        if (!args.length) return bot.chat(`usage: ${bot.prefix}ipfilter <hash> (list/remove/add) <cmd>`);

        if (args[0] === bot.hash.admin) {
            bot.hash.admin = generateHash(process.env['adminkey']);

            if (args[1] === 'add') {
                const userToAdd = args[2];
                if (!userToAdd) return bot.chat('Specify user to add.');

                if (!bot.filteredip) bot.filteredip = [];

                if (bot.filteredip.includes(userToAdd)) {
                return bot.chat(`${userToAdd} is already filtered.`);
                }

                bot.filteredip.push(userToAdd);

                let current = [];
                try {
                current = fs.readFileSync(filterFilePath, 'utf8').split('\n').filter(Boolean);
                } catch {}

                if (!current.includes(userToAdd)) {
                current.push(userToAdd);
                fs.writeFileSync(filterFilePath, current.join('\n'));
                }

                bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Filtering IP`, color: "#61f272"},{text: `${args[2]}`, color: "white"}]})}`)
            } else if (args[1] === 'list') {
                let current = [];
                try {
                current = fs.readFileSync(filterFilePath, 'utf8').split('\n').filter(Boolean);
                } catch {}

                bot.core.run(`tellraw @a ${JSON.stringify(
                    {translate: "[%s] %s\n %s", color: "dark_gray", with:[
                            {text: `ȼBot`, color: "#2dfc65"},
                            {text: `Filtering IPs:`, color: "#61f272"},
                            {text:`${current.join(', ') || '*none*'}`, color: "white"}
                        ]
                    })}`)

            } else if (args[1] === 'remove') {
                const userToRemove = args[2];
                if (!userToRemove) return bot.chat('Specify ip to remove.');

                if (!bot.filteredip) bot.filteredip = [];

                bot.filteredip = bot.filteredip.filter(u => u !== userToRemove);

                let current = [];
                try {
                current = fs.readFileSync(filterFilePath, 'utf8').split('\n').filter(Boolean);
                } catch {}

                current = current.filter(u => u !== userToRemove);
                fs.writeFileSync(filterFilePath, current.join('\n'));

                bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Unfiltering IP`, color: "#61f272"},{text: `${args[2]}`, color: "white"}]})}`)
            } else {
                return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid usage! Usage: ${bot.prefix}ipfilter <hash> <add/list/remove> [user]`, color: "#db1c02"}]})}`)
            }
        } else return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid hash!`, color: "#db1c02"}]})}`)
    }
};
