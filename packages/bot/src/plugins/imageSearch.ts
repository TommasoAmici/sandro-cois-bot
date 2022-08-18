import google from "googlethis";
import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";

export const sendImageFromQuery = async (ctx: Context, query: string) => {
  const images = await google.image(query, { safe: false });
  const { url } = images[0];
  ctx.replyWithPhoto(url, {
    reply_to_message_id: ctx.msg.message_id,
  });
};

const handler = async (ctx: HearsContext<Context>) => {
  let query = ctx.match[1];

  if (query === undefined && ctx.msg.reply_to_message) {
    query = ctx.msg.reply_to_message.text;
  }

  sendImageFromQuery(ctx, query);
};

export const imageSearch = new Composer();
imageSearch.hears(/^[/!][iì](?:@\w+)? (.+)/i, handler);
imageSearch.hears(/^[/!][iì](?:@\w+)?$/i, handler);
