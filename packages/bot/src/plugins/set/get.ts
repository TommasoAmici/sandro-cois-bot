import { Context, HearsContext } from "grammy";
import { media } from "../../commands";
import client from "../../redisClient";
import { getImage } from "../getImage";
import { getGif, sendGif } from "../giphy";

export default (mediaMsg: Media) => async (ctx: HearsContext<Context>) => {
  const key = ctx.match[1].toLowerCase();
  const hkey = `chat:${ctx.chat.id}:${mediaMsg.type}`;
  const fileId = await client.hget(hkey, key);
  if (mediaMsg === media.stickers) {
    if (fileId !== null) {
      ctx.replyWithSticker(fileId);
    }
  } else if (mediaMsg === media.photos) {
    if (fileId !== null) {
      ctx.replyWithPhoto(fileId);
    } else {
      // if no image is set try google api
      try {
        await getImage(key, ctx);
      } catch (error) {
        await ctx.reply("Error :(");
        console.error(error);
      }
    }
  } else if (mediaMsg === media.gifs) {
    if (fileId !== null) {
      ctx.replyWithDocument(fileId);
    } else {
      try {
        const response = await getGif(key);
        await sendGif(ctx, response);
      } catch (error) {
        await ctx.reply("Error :(");
        console.error(error);
      }
    }
  }
};
