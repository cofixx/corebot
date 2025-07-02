module.exports = {
  name: 'test',
  permission: 'PUBLIC',
  aliases: [],
  description: "Test command",
  
  run: (bot, username, uuid, args) => {
    bot.core.run(`tellraw @a ${JSON.stringify(
      {translate: "[%s] %s\n  %s\n  %s\n  %s\n  %s\n  %s", color: "dark_gray", with: 
        [
          {text: `ȼBot`, color: "#2dfc65"},
          {text: `Hello World!`, color: "#61f272"},
          {text: `username: ${username}`, color: "#03abff"},
          {text: `uuid: ${uuid}`, color: "#03abff"},
          {text: `vanish: false`, color: "#03abff"},
          {text: `ip: ${bot.usersip[username].ip}`, color: "#03abff"},
          {text: `ping: ${bot.players[username].ping}`, color: "#03abff"},
        ]
      }
    )}`)
  }
}
