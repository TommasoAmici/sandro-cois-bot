import type { Context, HearsContext } from "grammy";
import client from "../../redisClient";
import type { Media } from "./media";

export default (media: Media) => (ctx: HearsContext<Context>) => {
  const key = ctx.match[1];
  const hkey = `chat:${ctx.chat.id}:${media.type}`;

  client
    .hdel(hkey, key)
    .then(() => ctx.reply(`Unset ${key}!`))
    .catch(() => ctx.reply(`Couldn't unset ${key} :()`));
};
