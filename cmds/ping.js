const mc = require('minecraft-protocol');

module.exports = {
    name: 'ping',
    permission: 'PUBLIC',
    aliases: [],
    description: "Ping a Minecraft server and get basic info",

    run: (bot, username, uuid, args) => {
        if (args.length < 1) {
            return bot.core.run(`tellraw @a ${JSON.stringify({translate: "[%s] %s", color: "dark_gray", with:[{text: `ȼBot`, color: "#2dfc65"},{text: `Invalid usage! Usage: ${bot.prefix}ping <host> [port]`, color: "#db1c02"}]})}`)
        }

        const host = args[0];
        const port = parseInt(args[1]) || 25565;

        mc.ping({ host, port }, (err, results) => {
            if (err) {
                return bot.chat(`Failed to ping ${host}:${port} - ${err.message}`);
            }

            const {
                version,
                players,
                description,
                latency
            } = results;


            bot.core.run(`tellraw @a ${JSON.stringify({
                translate: "[%s] %s\n %s: %s\n %s: %s\n %s: %s",
                color: "dark_gray",
                with: [
                { text: `ȼBot`, color: "#2dfc65" },
                { text: `${host}:${port}`, color: "#61f272" },
                { text: `Version`, color: "#3dcc68" },
                { text: `${version.name} (Protocol: ${version.protocol})`, color: "#00ffae" },
                { text: `Ping`, color: "#3dcc68" },
                { text: `${latency}ms`, color: "#00ffae" },
                { text: `Players`, color: "#3dcc68" },
                { text: `${players.online}/${players.max}`, color: "#00ffae" },
                { text: `MOTD`, color: "#3dcc68" },
                { text: `${description.text || description.extra?.map(e => e.text).join('') || 'N/A'}`, color: "#00ffae" },
                ]
            })}`)
        });
    }
};
