import type { Context, HearsContext } from "grammy";

export const telegramPremium = (ctx: HearsContext<Context>) => {
  ctx.banChatMember(ctx.msg.from.id);
  ctx.unbanChatMember(ctx.msg.from.id);
  ctx.replyWithSticker("CAADBAADxAADuChICFX6VrCSrzkLAg");
};
