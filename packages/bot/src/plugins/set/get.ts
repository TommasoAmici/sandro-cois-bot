import type { Context } from "grammy";
import client from "../../redisClient";
import { sendGifFromQuery } from "../giphy";
import { sendImageFromQuery } from "../imageSearch";
import { media, Media } from "./media";

export default (mediaMsg: Media) =>
  async (ctx: Context): Promise<void> => {
    const key = ctx.match[1].toLowerCase();
    const hkey = `chat:${ctx.chat.id}:${mediaMsg.type}`;
    const fileID = await client.hget(hkey, key);
    if (mediaMsg === media.stickers) {
      if (fileID !== null) {
        ctx.replyWithSticker(fileID);
      }
    } else if (mediaMsg === media.photos) {
      if (fileID !== null) {
        ctx.replyWithPhoto(fileID);
      } else {
        // if no image is set try google api
        try {
          sendImageFromQuery(ctx, key);
        } catch (error) {
          if (error.response && error.response.status >= 400) {
            ctx.reply(error.response.status);
          }
          console.error(error.response);
        }
      }
    } else if (mediaMsg === media.gifs) {
      if (fileID !== null) {
        ctx.replyWithDocument(fileID);
      } else {
        try {
          sendGifFromQuery(ctx, key);
        } catch (error) {
          if (error.response && error.response.status >= 400) {
            ctx.reply(error.response.status);
          }
          console.error(error.response);
        }
      }
    }
  };
