module.exports = {
    name: 'echo',
    permission: 'PUBLIC',
    aliases: ['say'],
    description: "Make the bot say smth",

    run: (bot, username, uuid, args) => {
        bot.chat(args.join(' '))
    }
}
