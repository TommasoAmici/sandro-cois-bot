import type { Context } from "grammy";
import { getFileID } from "./getFileID";
import type { Media } from "./media";
import set from "./set";

export default (regex: RegExp, media: Media) => (ctx: Context) => {
  // function runs for every document, but it's not always applicable
  if (ctx.msg.reply_to_message) {
    let key: string;
    try {
      key = ctx.msg.reply_to_message.text.match(regex)[1].toLowerCase();
    } catch (e) {
      key = null;
    }
    if (key !== null) {
      const fileID = getFileID(ctx.msg, media);
      set(ctx, media, key, fileID);
    }
  }
};
