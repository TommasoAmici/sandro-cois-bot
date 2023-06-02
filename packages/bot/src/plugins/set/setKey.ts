import { Context, HearsContext } from "grammy";
import { fileIDFromMessage } from "./getFileId";
import set from "./set";

export default (media: Media) => async (ctx: HearsContext<Context>) => {
  if (ctx.msg?.reply_to_message) {
    const key = ctx.match[1].toLowerCase();
    const fileId = fileIDFromMessage(ctx.msg.reply_to_message, media);
    if (fileId === undefined) {
      return;
    }
    await set(ctx, media, key, fileId);
  } else {
    await ctx.reply(
      `Reply to this message with the ${
        media.type
      } for ${ctx.match[1].toLowerCase()}.${media.ext}`,
    );
  }
};
