import utils from "./utils";
import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  let count = +match[1];
  if (count === undefined || count === 0) count = 1;
  if (count >= 1000) count = 1000;

  let sides = +match[2];
  if (sides >= Number.MAX_SAFE_INTEGER) sides = Number.MAX_SAFE_INTEGER;

  if (isNaN(sides)) {
    sides = count;
    count = 1;
  }

  let total = 0;
  let throws = [];
  for (let i = 0; i < count; i++) {
    let val = utils.randInt(1, sides);
    total += val;
    throws.push(val);
  }

  bot.sendMessage(msg.chat.id, `${throws.join(" ")} | Total: ${total}`);
};
