import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot: TelegramBot, db: Cetriolino) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  const quote = match[1];

  db.set(String(msg.message_id), quote);

  bot.sendMessage(msg.chat.id, "Quote added!");
};
