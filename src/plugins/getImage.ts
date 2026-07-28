import { randomChoice } from "./utils/random";
import { searchImages } from "./utils/imageSearch";

import type { Context, HearsContext } from "grammy";

export const getImage = async (
  query: string,
  ctx: HearsContext<Context>,
): Promise<void> => {
  let images: Awaited<ReturnType<typeof searchImages>>;
  try {
    images = await searchImages(query);
  } catch (error) {
    console.error(error);
    await ctx.reply("Error while fetching image.", {
      reply_to_message_id: ctx.msg.message_id,
    });
    return;
  }
  if (!images || images.length === 0) {
    await ctx.reply("No photo found.", {
      reply_to_message_id: ctx.msg.message_id,
    });
  } else {
    const item = randomChoice(images);
    await ctx.replyWithPhoto(item.url, {
      reply_to_message_id: ctx.msg.message_id,
    });
  }
};

export default (ctx: HearsContext<Context>) => {
  if (ctx.msg.from?.id === 58057732) {
    ctx.reply("SMETTELKTE DI SPAMMARE DIOCAN E");
    return;
  }
  let query = ctx.match[1];

  if (query === undefined && ctx.msg.reply_to_message?.text) {
    query = ctx.msg.reply_to_message.text;
  }

  if (!query || query.trim() === "") {
    return;
  }

  getImage(query, ctx);
};
