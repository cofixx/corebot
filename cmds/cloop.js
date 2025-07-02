var { trustchar, ownerchar, hashmaker } = require('../hash.js');
module.exports = {
    name: 'cloop',
    permission: 'ADMIN',
    aliases: [],
    description: "Loop a command",
  
    run: (bot, username, uuid, args) => {
        if (!args.length) return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid usage! Usage: ${bot.prefix}cloop <hash> <add/list/remove> [ms] [command]`, color: "#db1c02"}]})}`)
        if (!bot.cloop) return bot.cloop = {}

        if (args[0] === bot.hash.trust) {
            bot.hash.trust = hashmaker(trustchar);

            if (args[1] === 'add') {
                const loopId = bot.cloop.i;
                bot.cloop.i++;

                const command = args.slice(3).join(' ');

                bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Creating a cloop with id: ${loopId} with ${args[2]}ms`, color: "#61f272"}]})}`)

                bot.cloop.id[loopId] = {
                    cmd: command,
                    interval: setInterval(() => {
                        bot.core.run(command);
                    }, args[2])
                };

            } else if (args[1] === 'list') {
                const loops = Object.entries(bot.cloop.id);
                if (loops.length === 0) {
                    //#61f272 error: #db1c02
                    bot.core.run(`tellraw @a ${JSON.stringify({
                        translate: "[%s] %s",
                        color: "dark_gray",
                        with: [
                        { text: `ȼBot`, color: "#2dfc65" },
                        { text: `No cloops found`, color: "#db1c02" },
                        ]
                    })}`)
                } else {
                    let message = loops.map(([id, data]) => `id: ${id} (${data.cmd})`).join('\n');
                    bot.core.run(`tellraw @a ${JSON.stringify({
                        translate: "[%s] %s\n %s",
                        color: "dark_gray",
                        with: [
                        { text: `ȼBot`, color: "#2dfc65" },
                        { text: `Cloops:`, color: "#db1c02" },
                        { text: `${message}`, color: "white"}
                        ]
                    })}`)
                }

            } else if (args[1] === 'remove') {
                const loopId = args[2];

                if (bot.cloop.id[loopId]) {
                    clearInterval(bot.cloop.id[loopId].interval);
                    delete bot.cloop.id[loopId];

                    bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Removing cloop with id: ${args[2]}`, color: "#61f272"}]})}`)
                } else {
                    bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Cloop with id: ${loopId} doesn't exist`, color: "#db1c02"}]})}`)
                }
            }
        } else return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid hash!`, color: "#db1c02"}]})}`)
    }
}
