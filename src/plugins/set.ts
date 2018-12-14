import { Message } from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot, db: Cetriolino) => (
  msg: Message,
  match: RegExpMatchArray
) => {
  const key = match[1];
  const val = match[2];

  const message = `${key} => ${val}`;

  db.set(key, val);

  bot.sendMessage(msg.chat.id, message);
};
