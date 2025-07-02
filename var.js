module.exports = (bot) => {
    bot.users = []
    var delay = 1000
    async function getUsers(delay) {
    try {
        const matches = await bot.tabComplete('/minecraft:msg ', true, true, delay);
        const toRemove = ['@a', '@e', '@n', '@p', '@r', '@s'];
        bot.users = []
        bot.users = matches
        .map(item => item.match)
        .filter(name => !toRemove.includes(name));
    } catch (err) {
        bot.users = [];
    }
    }
    setInterval(() => {
        getUsers(delay)
    }, delay)
}