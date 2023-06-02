import { Context, HearsContext } from "grammy";
import client from "../../redisClient";

export default (media: Media) => async (ctx: HearsContext<Context>) => {
  const hkey = `chat:${ctx.chat.id}:${media.type}`;
  const allKeys: string[] = await client.hkeys(hkey);
  const list = allKeys.join("\n");
  await ctx.reply(list);
};
