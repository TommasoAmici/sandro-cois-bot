import type { Context, HearsContext } from "grammy";

export const what = (ctx: HearsContext<Context>) => {
  if (ctx.message?.reply_to_message?.text !== undefined) {
    return ctx.reply(ctx.message.reply_to_message.text.toUpperCase());
  }
};
