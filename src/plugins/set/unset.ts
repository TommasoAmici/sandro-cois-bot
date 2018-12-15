import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot: TelegramBot, db: Cetriolino, ext?: string) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  const key = match[1];

  db.remove(key);

  bot.sendMessage(msg.chat.id, `Unset ${key}${ext}`);
};
