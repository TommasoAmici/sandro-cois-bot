import { Message } from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot, db: Cetriolino) => (
  msg: Message,
  match: RegExpMatchArray
) => {
  const quote = match[1];

  db.set(String(msg.message_id), quote);

  bot.sendMessage(msg.chat.id, "Quote added!");
};
