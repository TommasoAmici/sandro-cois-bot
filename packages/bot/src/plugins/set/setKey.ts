import type { Context, HearsContext } from "grammy";
import { getFileID } from "./getFileID";
import type { Media } from "./media";
import set from "./set";

export default (media: Media) => (ctx: HearsContext<Context>) => {
  if (ctx.msg.reply_to_message) {
    const key = ctx.match[1].toLowerCase();
    const fileID = getFileID(ctx.msg.reply_to_message, media);
    set(ctx, media, key, fileID);
  } else {
    ctx.reply(
      `Reply to this message with the ${
        media.type
      } for ${ctx.match[1].toLowerCase()}.${media.ext}`,
    );
  }
};
