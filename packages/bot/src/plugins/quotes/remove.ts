import { Context, HearsContext } from "grammy";
import client from "../../redisClient";
import { searchQuotes } from "./get";

const authorDateRegex = /\n*- (.+)( - \d+-\d+-\d+)?$/;

export default async (ctx: HearsContext<Context>) => {
  if (
    ctx.msg?.reply_to_message?.text &&
    ctx.msg.reply_to_message.text.length !== 0
  ) {
    const quote = ctx.msg.reply_to_message.text.replace(authorDateRegex, "");
    const search = await searchQuotes(ctx.chat.id, quote, 1);
    if (search.length === 0) {
      await ctx.reply("Couldn't remove quote :(");
    } else if (search.length === 1) {
      await client.zrem(`chat:${ctx.chat.id}:quotes`, search[0].id);
      await client.del(`chat:${ctx.chat.id}:quotes:${search[0].id}`);
      await ctx.reply("Quote removed!");
    } else {
      await ctx.reply("I found more than one quote, not sure what to do");
    }
  }
};
