import type { Context, HearsContext } from "grammy";

const convert = (word: string) => {
  const output: string[] = [];
  for (const char of word) {
    output.push(Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase());
  }
  return output.join("");
};

export const spongebob = (ctx: HearsContext<Context>) => {
  if (ctx.match[1] !== "") {
    return ctx.reply(convert(ctx.match[1]));
  } else if (ctx.message?.reply_to_message?.text !== undefined) {
    return ctx.reply(convert(ctx.message?.reply_to_message?.text));
  }
};
