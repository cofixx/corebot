module.exports = {
    name: 'urban',
    permission: 'PUBLIC',
    aliases: ['ud'],
    description: "Get definition from Urban Dictionary",

    run: async (bot, username, uuid, args) => {
        if (!args.length) {
            return bot.chat("Please provide a word or phrase to define.");
        }

        const term = args.join(' ');
        try {
            const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
            const data = await res.json();

            if (!data.list || data.list.length === 0) {
                return bot.chat(`No results found for "${term}".`);
            }

            let def = data.list[0].definition;
            def = def.replace(/[\r\n]+/g, ' ').replace(/\[|\]/g, '');

            bot.core.run(`say <${term}> ${def}`);
        } catch (error) {
            console.error('Urban command error:', error);
            bot.chat('Sorry, something went wrong fetching the definition.');
        }
    }
};
