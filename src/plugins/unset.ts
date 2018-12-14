import { Message } from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot, db: Cetriolino) => (
  msg: Message,
  match: RegExpMatchArray
) => {
  const key = match[1];

  db.remove(key);

  bot.sendMessage(msg.chat.id, `Unset ${key}`);
};
