import { Context } from "grammy";

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

  const chunks: string[] = [];
  if (longMsg.length > 3000) {
    await ctx.reply("Dio porco ti ammazzo!");
    return;
  }
  const maxChars = longMsg.length;
  for (let i = 0; i < maxChars; i += 3000) {
    chunks.push(longMsg.substring(i, i + 3000));
  }
  chunks.forEach(async (chunk) => {
    await ctx.reply(chunk);
  });
};
