import { Context, HearsContext } from "grammy";
import client from "../../../redisClient";

export default (media: Media) => async (ctx: HearsContext<Context>) => {
  const key = ctx.match[1];
  const val = ctx.match[2];

  const hkey = `chat:${ctx.chat.id}:${media.type}`;

  try {
    await client.hset(hkey, key, val);
    const message = `${key} => ${val}`;
    await ctx.reply(message);
  } catch (error) {
    await ctx.reply(`Couldn't set ${key} :(`);
  }
};
