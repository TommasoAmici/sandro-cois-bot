import { Message } from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot, db: Cetriolino) => (msg: Message) => {
  const message = db.random();
  bot.sendMessage(msg.chat.id, message);
};
