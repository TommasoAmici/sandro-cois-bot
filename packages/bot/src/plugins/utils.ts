import type { Context, HearsContext } from "grammy";

export const toTitleCase = (str: string): string =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );

const paginateMessages = (ctx: HearsContext<Context>, longMsg: string) => {
  const chunks: string[] = [];
  if (longMsg.length > 3000) {
    ctx.reply("Dio porco ti ammazzo!");
    return;
  }
  const maxChars = longMsg.length;
  for (let i = 0; i < maxChars; i += 3000) {
    chunks.push(longMsg.substring(i, i + 3000));
  }
  chunks.forEach(chunk => {
    ctx.reply(chunk);
  });
};

export default {
  toTitleCase,
  paginateMessages,
};
