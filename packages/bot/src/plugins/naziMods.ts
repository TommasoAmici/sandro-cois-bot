import type { Context, HearsContext } from "grammy";

export const naziMods = async (ctx: HearsContext<Context>) => {
  const admins = await ctx.getChatAdministrators();
  const nazis =
    "Taking my mods for a walk ( ͡° ͜ʖ ͡°)╯╲___卐卐卐卐\n\n" +
    admins.map(a => a.user.username).join("\n");
  ctx.reply(nazis);
};
