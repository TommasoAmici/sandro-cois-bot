import { middlewareFactory } from "@/middleware";
import { Composer, Context } from "grammy";

const URLS_TO_MAP = new Set(["twitter.com", "mobile.twitter.com", "x.com"]);

/**
 * Removes query parameters from twitter.com URLs to fix the preview in telegram
 */
async function twitterPreview(ctx: Context) {
  async function sendTweet(url: URL) {
    if (URLS_TO_MAP.has(url.host)) {
      url.search = "";
      url.hostname = "fxtwitter.com";
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
