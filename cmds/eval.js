const { spawn } = require('child_process');

module.exports = {
    name: 'eval',
    permission: 'PUBLIC', // or PUBLIC if you’re testing
    aliases: [],
    description: "public eval (plz report bugs or exploits)",

    run: (bot, username, uuid, args) => {
        const code = args.join(' ');
        if (!code) return

        const docker = spawn('docker', [
            'run', '--rm', '-i',
            '--memory', '128m',
            '--cpus', '0.25',
            'vmeval'
        ]);

        let output = '';
        docker.stdout.on('data', data => output += data);
        docker.stderr.on('data', data => output += data);

        docker.on('close', () => {
            const result = output.trim().slice(0, 256);
            bot.core.run(`tellraw @a ${JSON.stringify({
                translate: "[%s] %s\n %s",
                color: "dark_gray",
                with: [
                { text: `ȼBot`, color: "#2dfc65" },
                { text: `Output`, color: "#61f272" },
                { text: `${result || ""}`, color: "white" },
                ]
            })}`)
        });

        docker.stdin.write(code);
        docker.stdin.end();
    }
};
