import type { Context, HearsContext } from "grammy";
import client from "../../../redisClient";
import type { Media } from "../media";

export default (media: Media) => async (ctx: HearsContext<Context>) => {
  const hkey = `chat:${ctx.chat.id}:${media.type}`;
  const key = ctx.match[0];
  const message = await client.hget(hkey, key);

  if (message && message.length !== 0) {
    ctx.reply(message);
  }
};
