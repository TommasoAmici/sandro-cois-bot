import type { Context } from "grammy";

export const toTitleCase = (str: string): string =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );

export const paginateMessages = async (
  ctx: Context,
  longMsg: string | undefined | null,
) => {
  if (longMsg === undefined || longMsg === null) {
    return;
  }

  if (longMsg.length > 3000) {
    await ctx.reply("Dio porco ti ammazzo!");
    return;
  }
  const maxChars = longMsg.length;
  for (let i = 0; i < maxChars; i += 3000) {
    await ctx.reply(longMsg.substring(i, i + 3000));
  }
};
