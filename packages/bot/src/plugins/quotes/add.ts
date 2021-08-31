import * as TelegramBot from "node-telegram-bot-api";
import * as utf8 from "utf8";
import client from "../../redisClient";

const createIndex = (chatID: number) =>
  client
    .send_command(
      "FT.CREATE",
      `chat:${chatID}:quotes-index`,
      "ON",
      "HASH",
      "PREFIX",
      1,
      `chat:${chatID}:quotes:`,
      "SCHEMA",
      "body",
      "TEXT",
      "author",
      "TEXT"
    )
    .then()
    .catch();

export const addQuote = async (
  body: string,
  author: string,
  date: string,
  chatId: number,
  bot: TelegramBot
) => {
  const key = `chat:${chatId}:quotes`;

  createIndex(chatId);

  const id = await client.incr("quotes-id");
  client.zadd(key, Date.now(), id);
  client
    .hset(`${key}:${id}`, "body", body, "author", author, "date", date)
    .then(() => bot.sendMessage(chatId, "Quote added!"))
    .catch(() => bot.sendMessage(chatId, "Couldn't add quote :("));
};

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    const quote = utf8.encode(match[1]);
    addQuote(quote, "", null, msg.chat.id, bot);
  };
