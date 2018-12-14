import { Message } from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot, db: Cetriolino) => (
  msg: Message,
  match: RegExpMatchArray
) => {
  const stickerId = db.get(match[1]);
  if (stickerId && stickerId.length !== 0) {
    bot.sendSticker(msg.chat.id, stickerId);
  }
};
