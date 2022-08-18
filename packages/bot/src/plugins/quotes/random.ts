import type { Context, HearsContext } from "grammy";

import client from "../../redisClient";
import { formatQuote, IQuote } from "./utils";

export default async (ctx: HearsContext<Context>) => {
  const key = `chat:${ctx.chat.id}:quotes`;
  const quoteID = await client.zrandmember(key);
  client.hgetall(`${key}:${quoteID}`, (err, record) => {
    if (err) {
      console.error(err);
      ctx.reply("Something went wrong :(");
    } else {
      const formattedQuote = formatQuote(record as unknown as IQuote);
      ctx.reply(formattedQuote);
    }
  });
};
