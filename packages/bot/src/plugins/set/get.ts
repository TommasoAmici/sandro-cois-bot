import TelegramBot from "node-telegram-bot-api";
import { media } from "../..";
import client from "../../redisClient";
import { getImage } from "../getImage";
import { getGif, sendGif } from "../giphy";

export default (bot: TelegramBot, mediaMsg: Media) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray): Promise<void> => {
    const key = match[1].toLowerCase();
    const hkey = `chat:${msg.chat.id}:${mediaMsg.type}`;
    const fileId = await client.hget(hkey, key);
    if (mediaMsg === media.stickers) {
      if (fileId !== null) bot.sendSticker(msg.chat.id, fileId);
    } else if (mediaMsg === media.photos) {
      if (fileId !== null) {
        bot.sendPhoto(msg.chat.id, fileId);
      } else {
        // if no image is set try google api
        try {
          getImage(key, bot, msg);
        } catch (error) {
          if (error.response && error.response.status >= 400) {
            bot.sendMessage(msg.chat.id, error.response.status);
          }
          console.error(error.response);
        }
      }
    } else if (mediaMsg === media.gifs) {
      if (fileId !== null) {
        bot.sendDocument(msg.chat.id, fileId);
      } else {
        try {
          const response = await getGif(key);
          sendGif(bot, msg, response);
        } catch (error) {
          if (error.response && error.response.status >= 400) {
            bot.sendMessage(msg.chat.id, error.response.status);
          }
          console.error(error.response);
        }
      }
    }
  };
