import * as TelegramBot from "node-telegram-bot-api";
import utils from "./utils";

var gis = require("g-i-s");

export const getImage = async (
  query: string,
  bot: TelegramBot,
  msg: TelegramBot.Message
): Promise<void> => {
  const response = gis(query, (error, results) => {
    if (error) {
      bot.sendMessage(msg.chat.id, error);
    } else {
      if (!results || results.length === 0) {
        bot.sendMessage(msg.chat.id, "No photo found.");
      } else {
        const item = utils.randomChoice(results as ImageItem[]);
        bot.sendPhoto(msg.chat.id, item.url);
      }
    }
  });
};

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    let query = match[1];

    if (query === undefined && msg.reply_to_message) {
      query = msg.reply_to_message.text;
    }
    getImage(query, bot, msg);
  };
