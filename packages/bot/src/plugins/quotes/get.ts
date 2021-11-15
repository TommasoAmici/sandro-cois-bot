import TelegramBot from "node-telegram-bot-api";
import * as utf8 from "utf8";
import client from "../../redisClient";
import { randomChoice } from "../utils/random";
import random from "./random";

export interface IQuote {
  id: string;
  body: string;
  author?: string;
  date?: string;
}

export const formatQuote = (quote: IQuote) => {
  let body = quote.body;
  if (quote.author) {
    body += `\n- ${quote.author}`;
  }
  if (quote.date) {
    body += ` - ${quote.date}`;
  }
  return body;
};

export const searchQuotes = async (
  chatID: number,
  query: string,
  limit = 10
) => {
  const res = await client.send_command("FT.SEARCH", [
    `chat:${chatID}:quotes-index`,
    query,
    "limit",
    0,
    limit,
  ]);
  // transform redis response in objects
  const quotes: IQuote[] = res
    .slice(1)
    .filter((s, i) => i % 2 === 1)
    .map((s) => {
      const obj = {};
      for (let index = 0; index < s.length; index += 2) {
        const key = s[index];
        const value = s[index + 1];
        obj[key] = value;
      }
      return obj;
    });
  return quotes;
};

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray): Promise<void> => {
    const toMatch = utf8.encode(match[1]);
    if (toMatch === "") {
      return random(bot)(msg);
    } else {
      const quotes = await searchQuotes(msg.chat.id, toMatch);
      if (quotes.length === 0) {
        bot.sendMessage(msg.chat.id, "No quote found :(");
      }
      const quote = randomChoice(quotes);
      bot.sendMessage(msg.chat.id, formatQuote(quote));
    }
  };
