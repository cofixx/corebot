module.exports = (bot) => {
  bot.on('messagestr', (message) => {
    if (message === "Successfully disabled CommandSpy") {
      bot.core.run(`/commandspy:commandspy ${bot.username} on`)
    }
    if (message === `Vanish for ${bot.username}: disabled`) {
      bot.core.run(`/essentials:vanish ${bot.username} on`)
    }
    if (message === "Teleportation enabled.") {
      bot.core.run(`/essentials:tptoggle ${bot.username} off`)
    } 
  })

   bot._client.on("entity_status", function (packet) {
     if (packet.entityStatus < 24 || packet.entityStatus > 28) return;
     if (packet.entityStatus - 24 <= 0) {
         bot.chat("/minecraft:op @s[type=player]")
     }
   })

   bot._client.on('game_state_change', function (packet) {
     if (packet.reason == 3) {
        bot.chat("/minecraft:gamemode creative");
     }
   })

  bot.on('position', (packet) => {
    bot.write('teleport_confirm', { teleportId: packet.teleportId });

    bot.emit('move');
  });
  setTimeout(() => {
      bot.on('move', () => { 1 })
  }, 2000)
}