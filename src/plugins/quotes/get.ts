import * as TelegramBot from "node-telegram-bot-api";
import utils from "../utils";
import Cetriolino from "cetriolino";

const findQuote = (str: string, db: Cetriolino) => {
  const keys = utils.shuffle(db.keys());
  for (let k in keys) {
    let quote = db.get(keys[k]);
    if (quote.toLowerCase().includes(str)) {
      return quote;
    }
  }
  return false;
};

export default (bot: TelegramBot, db: Cetriolino) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  const quote = findQuote(match[1].toLowerCase(), db);

  if (quote) bot.sendMessage(msg.chat.id, quote);
};
