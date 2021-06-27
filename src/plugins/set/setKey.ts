import * as TelegramBot from "node-telegram-bot-api";
import getFileId from "./getFileId";
import set from "./set";
import { Media } from "../../main";

export default (bot: TelegramBot, media: Media) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    if (msg.reply_to_message) {
      const key = match[1].toLowerCase();
      const fileId = getFileId(msg.reply_to_message, media);
      set(bot, msg, media, key, fileId);
    } else {
      bot.sendMessage(
        msg.chat.id,
        `Reply to this message with the ${
          media.type
        } for ${match[1].toLowerCase()}.${media.ext}`
      );
    }
  };
