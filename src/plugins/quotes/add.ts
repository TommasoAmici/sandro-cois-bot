import * as TelegramBot from "node-telegram-bot-api";
import * as utf8 from "utf8";
import client from "../../redisClient";

export const addQuote = (quote, chatId, bot) => {
  const key = `chat:${chatId}:quotes`;
  client
    .sadd(key, quote)
    .then((res) => bot.sendMessage(chatId, "Quote added!"))
    .catch((err) => bot.sendMessage(chatId, "Couldn't add quote :("));
};

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    const quote = utf8.encode(match[1]);
    addQuote(quote, msg.chat.id, bot);
  };
