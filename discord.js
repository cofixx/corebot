require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')
const { MessageContent, GuildMessages, Guilds } = GatewayIntentBits;
const token = process.env['discordtoken']

module.exports = async (bot) => {
   const client = new Client({ intents: [Guilds, GuildMessages, MessageContent], }); await client?.login(token);
   const channel = client?.channels?.cache?.get(bot.server.channel);

    client.on("messageCreate", async (msg) => {
    if (msg.channel.id !== bot.server.channel) return;
    if (msg.author.bot) return;

    let username = msg?.author?.username;
    let message = msg?.content;

    // Get the highest role of the user
    const highestRole = msg.member?.roles.cache
        .sort((a, b) => b.position - a.position) // Sort roles by position
        .first(); // Get the highest role

    // Check if the user has a role
    let roleName = highestRole ? highestRole.name : 'NoRole';
    let roleColor = highestRole ? highestRole.color : 0xFFFFFF;

    let colorHex = `#${roleColor.toString(16).padStart(6, '0')}`;
    let json = JSON.stringify({
        translate: "[%s] %s > %s",
        color: "dark_gray",
        with: [
            { text: `ȼBot Discord`, color: "#2dfc65" },
            { text: `${username}`, color: `${colorHex}`, hoverEvent:{action: "show_text", contents:`Highest Role: @${roleName}`} },
            { text: `${message}`, color: "white" },
        ]
        })

    bot?.core?.run(`/tellraw @a ${json}`);
    });

    bot.discord = client;
    bot.channel = channel;
    return client;
}