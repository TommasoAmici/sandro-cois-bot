import type { Context, HearsContext } from "grammy";
import client from "../../redisClient";
import { searchQuotes } from "./get";

const authorDateRegex = /\n*- (.+)( - \d+-\d+-\d+)?$/;

export default async (ctx: HearsContext<Context>) => {
  if (
    ctx.msg.reply_to_message.text &&
    ctx.msg.reply_to_message.text.length !== 0
  ) {
    const quote = ctx.msg.reply_to_message.text.replace(authorDateRegex, "");
    const search = await searchQuotes(ctx.chat.id, quote, 1);
    if (search.length === 0) {
      ctx.reply("Couldn't remove quote :(");
    } else if (search.length === 1) {
      client.zrem(`chat:${ctx.chat.id}:quotes`, search[0].id);
      client.del(`chat:${ctx.chat.id}:quotes:${search[0].id}`);
      ctx.reply("Quote removed!");
    } else {
      ctx.reply("I found more than one quote, not sure what to do");
    }
  }
};
