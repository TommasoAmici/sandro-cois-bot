import { Context, HearsContext } from "grammy";

export const setTitle = async (ctx: HearsContext<Context>) => {
  try {
    ctx.setChatTitle(ctx.match[1]);
  } catch {
    await ctx.reply("You're not an admin :(");
  }
};
