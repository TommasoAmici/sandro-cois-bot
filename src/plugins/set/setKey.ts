import * as TelegramBot from "node-telegram-bot-api";
import { getFileId } from "./setValue";
import Cetriolino from "cetriolino";

export default (bot: TelegramBot, db: Cetriolino, ext: string) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  if (msg.reply_to_message) {
    const fileId = getFileId(msg.reply_to_message);
    db.set(match[1], fileId);
    bot.sendMessage(msg.chat.id, `Set ${match[1]}.${ext}!`);
  } else {
    bot.sendMessage(
      msg.chat.id,
      `Reply to this message with the ${ext} for ${match[1]}.${ext}`
    );
  }
};
