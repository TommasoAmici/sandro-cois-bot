import type { Context, HearsContext } from "grammy";
import client from "../../redisClient";
import type { Media } from "./media";

export default (media: Media) => async (ctx: HearsContext<Context>) => {
  const hkey = `chat:${ctx.chat.id}:${media.type}`;
  const allKeys: string[] = await client.hkeys(hkey);
  const list = allKeys.join("\n");
  ctx.reply(list);
};
