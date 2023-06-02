import { Context } from "grammy";
import client from "../../redisClient";

const set = async (ctx: Context, media: Media, key: string, fileId: string) => {
  const chatID = ctx?.chat?.id;
  if (chatID === undefined) {
    return;
  }

  const hkey = `chat:${chatID}:${media.type}`;
  try {
    await client.hset(hkey, key, fileId);
    await ctx.reply(`Set ${key}!`);
  } catch (error) {
    await ctx.reply(`Couldn't set ${key} :(`);
  }
};

export default set;
