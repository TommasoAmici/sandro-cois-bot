import type { Context } from "grammy";

export const nsfw = (ctx: Context) => {
  const message =
    "NSFW\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nNSFW";
  ctx.reply(message);
};
