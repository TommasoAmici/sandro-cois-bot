import { middlewareFactory } from "@/middleware";
import { Composer, Context } from "grammy";

/**
 * Removes query parameters from twitter.com URLs to fix the preview in telegram
 */
async function twitterPreview(ctx: Context) {
  async function sendTweet(url: URL) {
    if (url.host === "twitter.com") {
      url.search = "";
      url.hostname = "vxtwitter.com";
      await ctx.reply(url.toString());
    }
  }

  const text = ctx.msg?.text;
  if (text === undefined) {
    return;
  }

  for (const entity of ctx.entities(["url", "text_link"])) {
    if (entity.type === "url") {
      const url = new URL(entity.text);
      await sendTweet(url);
    } else if (entity.type === "text_link") {
      const url = new URL(entity.url);
      await sendTweet(url);
    }
  }
}

export const twitterComposer = new Composer();
twitterComposer.on("message", middlewareFactory(twitterPreview));
