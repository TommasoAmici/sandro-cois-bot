import { Context, HearsContext } from "grammy";
import client from "../../redisClient";

export default (media: Media) => async (ctx: HearsContext<Context>) => {
  const key = ctx.match[1];
  const hkey = `chat:${ctx.chat.id}:${media.type}`;

  try {
    await client.hdel(hkey, key);
    await ctx.reply(`Unset ${key}!`);
  } catch (error) {
    await ctx.reply(`Couldn't unset ${key} :()`);
  }
};
