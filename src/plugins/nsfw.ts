import type { Context, HearsContext } from "grammy";

const text =
  "NSFW\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nNSFW";

export const nsfw = async (ctx: HearsContext<Context>) => {
  await ctx.reply(text);
};
