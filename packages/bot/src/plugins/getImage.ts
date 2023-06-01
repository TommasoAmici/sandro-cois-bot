import TelegramBot from "node-telegram-bot-api";
import { randomChoice } from "./utils/random";

import google from "googlethis";

export const getImage = async (
  query: string,
  bot: TelegramBot,
  msg: TelegramBot.Message,
): Promise<void> => {
  try {
    const images = await google.image(query, { safe: false });
    if (!images || images.length === 0) {
      bot.sendMessage(msg.chat.id, "No photo found.", {
        reply_to_message_id: msg.message_id,
      });
    } else {
      const item = randomChoice(images);
      bot.sendPhoto(msg.chat.id, item.url, {
        reply_to_message_id: msg.message_id,
      });
    }
  } catch (error) {
    bot.sendMessage(msg.chat.id, String(error));
  }
};

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    let query = match[1];

    if (query === undefined && msg.reply_to_message) {
      query = msg.reply_to_message.text;
    }

    if (!query || query.trim() === "") {
      return;
    }

    getImage(query, bot, msg);
  };
