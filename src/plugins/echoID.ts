import type { Context, HearsContext } from "grammy";

export const echoID = async (ctx: HearsContext<Context>) => {
  await ctx.reply(String(ctx.chat.id));
};
