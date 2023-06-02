import { Context, NextFunction } from "grammy";
import { fileIDFromMessage } from "./getFileId";
import set from "./set";

export default (regex: RegExp, media: Media) =>
  async (ctx: Context, next: NextFunction) => {
    // function runs for every document, but it's not always applicable
    if (ctx.msg?.reply_to_message?.text) {
      let key: string | undefined;
      try {
        key = ctx.msg.reply_to_message.text.match(regex)?.[1].toLowerCase();
      } catch {
        key = undefined;
      }
      if (key !== null && key !== undefined) {
        const fileId = fileIDFromMessage(ctx.msg.reply_to_message, media);
        if (fileId) {
          await set(ctx, media, key, fileId);
        }
      }
    }
    await next();
  };
