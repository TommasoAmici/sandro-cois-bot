import math from "mathjs";
import { Message } from "node-telegram-bot-api";

export default bot => (msg: Message, match: RegExpMatchArray) => {
  try {
    const evaluated = math.eval(match[1]);
    if (typeof evaluated === "object") {
      // handle conversions
      if (match[1].includes(" to ")) {
        bot.sendMessage(
          msg.chat.id,
          `${evaluated.value / evaluated.units[0].unit.value} ${
            evaluated.units[0].unit.name
          }`
        );
      }
      // handle calcs with different units
      else {
        bot.sendMessage(
          msg.chat.id,
          `${evaluated.value / evaluated.units[0].prefix.value} ${
            evaluated.units[0].prefix.name
          }${evaluated.units[0].unit.name}`
        );
      }
    }
    // numerical expression needs no handling
    else {
      bot.sendMessage(msg.chat.id, evaluated);
    }
  } catch (error) {
    bot.sendMessage(msg.chat.id, "🤷🏻‍♂️");
  }
};
