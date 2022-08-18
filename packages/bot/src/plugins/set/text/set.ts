import type { Context, HearsContext } from "grammy";
import client from "../../../redisClient";
import type { Media } from "../media";

export default (media: Media) =>
  (ctx: HearsContext<Context>): void => {
    const key = ctx.match[1];
    const val = ctx.match[2];

    const hkey = `chat:${ctx.chat.id}:${media.type}`;

    client.hset(hkey, key, val, (err, res) => {
      if (err) {
        ctx.reply(`Couldn't set ${key} :(`);
      } else {
        const message = `${key} => ${val}`;
        ctx.reply(message);
      }
    });
  };
