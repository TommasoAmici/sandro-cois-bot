import type { Context, HearsContext } from "grammy";

export const ultimouomo = (ctx: HearsContext<Context>) =>
  ctx.reply("Basta ultimouomo, maledetto capiscer!", {
    reply_to_message_id: ctx.message.message_id,
  });
