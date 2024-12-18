import type { Context, HearsContext } from "grammy";

const _spongebob = (word: string) => {
  const output = [];
  for (const char of word) {
    output.push(Math.random() > 0.5 ? char.toUpperCase() : char);
  }
  return output.join("");
};

export const spongebobInReply = async (ctx: HearsContext<Context>) => {
  if (ctx.msg?.reply_to_message?.text) {
    const message = _spongebob(ctx.msg.reply_to_message.text.toLowerCase());
    await ctx.reply(message);
  }
};

export const spongebob = async (ctx: HearsContext<Context>) => {
  const message = _spongebob(ctx.match[1].toLowerCase());
  await ctx.reply(message);
};
