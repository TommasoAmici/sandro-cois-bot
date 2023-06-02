import { Context, HearsContext } from "grammy";

export const what = async (ctx: HearsContext<Context>): Promise<void> => {
  if (ctx.msg?.reply_to_message) {
    const text = ctx.msg?.reply_to_message?.text?.toUpperCase();
    if (text) {
      await ctx.reply(text);
    }
  }
};
