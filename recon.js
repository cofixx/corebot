const mc = require('minecraft-protocol');
module.exports = (bot) => {
    bot.on('kicked', reason => {
        console.log('Bot was ended');
        function tryReconnect() {
            bot.createBot(bot.server, bot.prefix);
        }

        tryReconnect();
    });

    bot.on('end', () => {
        console.log('Bot was ended');
        function tryReconnect() {
            bot.createBot(bot.server, bot.prefix);
        }

        tryReconnect();
    });
};
