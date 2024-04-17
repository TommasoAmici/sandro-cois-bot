import { Context, HearsContext } from "grammy";

/**
 * Command to debug a message object.
 * For replies, it prints a JSON dump of the original message.
 */
export const debugMessage = async (ctx: HearsContext<Context>) => {
  if (ctx.msg.reply_to_message === undefined) {
    return;
  }
  const dump = JSON.stringify(ctx.msg.reply_to_message, undefined, 2);
  await ctx.reply(`\`\`\`json\n${dump}\n\`\`\``, { parse_mode: "MarkdownV2" });
};
