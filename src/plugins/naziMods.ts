import { Context, HearsContext } from "grammy";

export const naziMods = async (ctx: HearsContext<Context>) => {
  try {
    const admins = await ctx.getChatAdministrators();
    const usernames = admins.map((a) => a.user.username).join("\n");
    const nazis = `Taking my mods for a walk ( ͡° ͜ʖ ͡°)╯╲___卐卐卐卐\n\n${usernames}`;
    await ctx.reply(nazis);
  } catch (error) {
    if (
      String(error).includes("there are no administrators in the private chat")
    ) {
      await ctx.reply("There are no admins in this chat");
    }
  }
};
