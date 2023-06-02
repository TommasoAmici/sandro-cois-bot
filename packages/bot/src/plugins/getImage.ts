import { randomChoice } from "./utils/random";

import google from "googlethis";
import { Context, HearsContext } from "grammy";

export const getImage = async (
  query: string,
  ctx: HearsContext<Context>,
): Promise<void> => {
  try {
    const images = await google.image(query, { safe: false });
    if (!images || images.length === 0) {
      ctx.reply("No photo found.", {
        reply_to_message_id: ctx.msg.message_id,
      });
    } else {
      const item = randomChoice(images);
      ctx.replyWithPhoto(item.url, {
        reply_to_message_id: ctx.msg.message_id,
      });
    }
  } catch (error) {
    ctx.reply(String(error));
  }
};

export default (ctx: HearsContext<Context>) => {
  let query = ctx.match[1];

  if (query === undefined && ctx.msg.reply_to_message?.text) {
    query = ctx.msg.reply_to_message.text;
  }

  if (!query || query.trim() === "") {
    return;
  }

  getImage(query, ctx);
};
