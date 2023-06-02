import { Context, HearsContext } from "grammy";

export const telegramPremium = async (ctx: HearsContext<Context>) => {
  const id = ctx.from?.id;
  if (id) {
    await ctx.banChatMember(id);
    await ctx.unbanChatMember(id);
    await ctx.replyWithSticker("CAADBAADxAADuChICFX6VrCSrzkLAg");
  }
};
