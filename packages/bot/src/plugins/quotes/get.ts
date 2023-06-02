import { Context, HearsContext } from "grammy";
import utf8 from "utf8";
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
  limit = 10,
) => {
  try {
    const res = await client.call("FT.SEARCH", [
      `chat:${chatID}:quotes-index`,
      query,
      "limit",
      0,
      limit,
    ]);
    // transform redis response in objects
    const quotes: IQuote[] = (res as any)
      .slice(1)
      .filter((s: any, i: number) => i % 2 === 1)
      .map((s: any) => {
        const obj: Record<any, any> = {};
        for (let index = 0; index < s.length; index += 2) {
          const key = s[index];
          const value = s[index + 1];
          obj[key] = value;
        }
        return obj;
      });
    return quotes;
  } catch (error) {
    return [];
  }
};

export default async (ctx: HearsContext<Context>) => {
  const toMatch = utf8.encode(ctx.match[1]);
  if (toMatch === "") {
    return random(ctx);
  } else {
    const quotes = await searchQuotes(ctx.chat.id, toMatch);
    if (quotes.length === 0) {
      await ctx.reply("No quote found :(");
      return;
    }
    const quote = randomChoice(quotes);
    await ctx.reply(formatQuote(quote));
  }
};
