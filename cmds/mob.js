module.exports = {
  name: 'mob',
  permission: 'PUBLIC',
  aliases: ['summon'],
  description: "Bypass mob limit (kinda..)",
  
  run: (bot, username, uuid, args) => {
    var mob = args[0];
    var amount = parseInt(args[1]);
    if (isNaN(amount) || amount < 1) {
      return bot.chat("&cinvalid number");
    }

    if (amount > 3450) return bot.chat("limit is 3450");

    for (let i = 0; i < amount; i++) {
      bot.core.run(`summon ${mob} ~ ~1 ~ {Tags:["corebotcuzyes1"]}`);
    }
    setTimeout(() => {
      bot.core.run(`minecraft:tp @e[type=${mob},tag=corebotcuzyes1] ${uuid}`);
      bot.core.run(`tag @e[type=${mob},tag=corebotcuzyes1] remove corebotcuzyes1`);
    }, 300)
  }
}
