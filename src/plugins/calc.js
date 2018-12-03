const math = require("mathjs");

module.exports = bot => (msg, match) => {
  const chatId = msg.chat.id;
  try {
    const evaluated = math.eval(match[1]);
    if (typeof evaluated === "object") {
      // handle conversions
      if (match[1].includes(" to ")) {
        bot.sendMessage(
          chatId,
          `${evaluated.value / evaluated.units[0].unit.value} ${
            evaluated.units[0].unit.name
          }`
        );
      }
      // handle calcs with different units
      else {
        bot.sendMessage(
          chatId,
          `${evaluated.value / evaluated.units[0].prefix.value} ${
            evaluated.units[0].prefix.name
          }${evaluated.units[0].unit.name}`
        );
      }
    }
    // numerical expression needs no handling
    else {
      bot.sendMessage(chatId, evaluated);
    }
  } catch (error) {
    bot.sendMessage(chatId, "🤷🏻‍♂️");
  }
};
