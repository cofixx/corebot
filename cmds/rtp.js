function r() {
  const c = '123456789';
  let r = '';
  for (let i = 0; i < 6; i++) {
    r += c.charAt(Math.floor(Math.random() * c.length));
  }
  return r;
}

module.exports = {
  name: "rtp",
  aliases: ['tpr'],
  description: "Teleport somewhere random",
  
  run: (bot, username, uuid, args) => {
    var x=r()
    var z=r()
    bot.core.run(`tellraw @a[name=!${username}] ${JSON.stringify(
      {translate: "[%s] %s\n %s %s %s", color: "dark_gray", with: 
        [
          {text: `ȼBot`, color: "#2dfc65"},
          {text: `Random Teleport`, color: "#61f272"},
          {text: `Teleporting`, color: "#03fca1"},
          {text: `${username}`, color: "white"},
          {text: `to a random location`, color: "#03fca1"},
        ]
      }
    )}`)
    bot.core.run(`tellraw "${username}" ${JSON.stringify(
      {translate: "[%s] %s\n %s %s", color: "dark_gray", with: 
        [
          {text: `ȼBot`, color: "#2dfc65"},
          {text: `Random Teleport (Only you can see this message)`, color: "#61f272"},
          {text: `Teleporting you to: X: ${x} Y: 100 Z: ${z}`, color: "#03fca1"},
          {text: `to a random location`, color: "#03fca1"},
        ]
      }
    )}`)
    bot.core.run(`minecraft:teleport "${username}" ${x} 100 ${z}`)
  }
}
