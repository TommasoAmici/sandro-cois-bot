import { evaluate } from "mathjs";
import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    try {
      const evaluated = evaluate(match[1]);
      if (typeof evaluated === "object") {
        // handle conversions
        if (match[1].includes(" to ")) {
          bot.sendMessage(
            msg.chat.id,
            `${evaluated.value / evaluated.units[0].unit.value} ${
              evaluated.units[0].unit.name
            }`,
          );
        }
        // handle calcs with different units
        else {
          bot.sendMessage(
            msg.chat.id,
            `${evaluated.value / evaluated.units[0].prefix.value} ${
              evaluated.units[0].prefix.name
            }${evaluated.units[0].unit.name}`,
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
