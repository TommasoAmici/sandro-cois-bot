import type { Context } from "grammy";
import client from "../../redisClient";
import type { Media } from "./media";

const set = (ctx: Context, media: Media, key: string, fileId: string) => {
  const hkey = `chat:${ctx.chat.id}:${media.type}`;

  client.hset(hkey, key, fileId, (err, res) => {
    if (err) {
      ctx.reply(`Couldn't set ${key} :(`);
    } else {
      ctx.reply(`Set ${key}!`);
    }
  });
};

export default set;
