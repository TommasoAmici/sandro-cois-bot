import type { Context, HearsContext } from "grammy";
import * as utf8 from "utf8";
import client from "../../redisClient";
import { randomChoice } from "../utils/random";
import random from "./random";
import { formatQuote, IQuote } from "./utils";

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
    console.log(res);
    // transform redis response in objects
    const quotes: IQuote[] = (res as any)
      .slice(1)
      .filter((s, i) => i % 2 === 1)
      .map(s => {
        const obj = {};
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
      ctx.reply("No quote found :(");
      return;
    }
    const quote = randomChoice(quotes);
    ctx.reply(formatQuote(quote));
  }
};
