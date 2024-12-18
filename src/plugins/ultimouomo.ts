import type { Context, HearsContext } from "grammy";

export const ultimouomo = async (ctx: HearsContext<Context>): Promise<void> => {
  await ctx.reply("Basta ultimouomo, maledetto capiscer!", {
    reply_to_message_id: ctx.msg?.message_id,
  });
};
