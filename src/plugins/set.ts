import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot: TelegramBot, db: Cetriolino) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  const key = match[1];
  const val = match[2];

  const message = `${key} => ${val}`;

  db.set(key, val);

  bot.sendMessage(msg.chat.id, message);
};
