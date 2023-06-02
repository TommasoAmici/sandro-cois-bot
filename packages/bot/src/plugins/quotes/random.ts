import { Context, HearsContext } from "grammy";
import client from "../../redisClient";
import { IQuote, formatQuote } from "./get";

export default async (ctx: HearsContext<Context>) => {
  const key = `chat:${ctx.chat.id}:quotes`;
  const quoteID = await client.zrandmember(key);
  client.hgetall(`${key}:${quoteID}`, async (err, record) => {
    if (err) {
      console.error(err);
      await ctx.reply("Something went wrong :(");
    } else {
      const formattedQuote = formatQuote(record as unknown as IQuote);
      await ctx.reply(formattedQuote);
    }
  });
};
