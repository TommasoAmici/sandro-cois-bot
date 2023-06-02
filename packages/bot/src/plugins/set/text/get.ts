import { Context, HearsContext } from "grammy";
import client from "../../../redisClient";

export default (media: Media) => async (ctx: HearsContext<Context>) => {
  // store every message to generate markov chains
  const hkey = `chat:${ctx.chat.id}:${media.type}`;
  const key = ctx.match[0];
  const message = await client.hget(hkey, key);

  if (message && message.length !== 0) {
    await ctx.reply(message);
  }
};
