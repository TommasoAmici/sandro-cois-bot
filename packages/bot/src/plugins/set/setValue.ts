import * as TelegramBot from "node-telegram-bot-api";
import getFileId from "./getFileId";
import set from "./set";

export default (bot: TelegramBot, regex: RegExp, media: Media) =>
  (msg: TelegramBot.Message): void => {
    // function runs for every document, but it's not always applicable
    if (msg.reply_to_message) {
      let key: string;
      try {
        key = msg.reply_to_message.text.match(regex)[1].toLowerCase();
      } catch (e) {
        key = null;
      }
      if (key !== null) {
        const fileId = getFileId(msg, media);
        console.warn(fileId);
        set(bot, msg, media, key, fileId);
      }
    }
  };
