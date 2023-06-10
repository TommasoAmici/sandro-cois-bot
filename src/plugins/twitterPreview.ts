import { Context } from "grammy";

/**
 * Removes query parameters from twitter.com URLs to fix the preview in telegram
 */
export async function twitterPreview(ctx: Context) {
  const sendTweet = async (url: URL) => {
    if (url.host === "twitter.com") {
      url.search = "";
      url.hostname = "vxtwitter.com";
      await ctx.reply(url.toString());
    }
  };
  const text = ctx.msg?.text;
  if (text === undefined) {
    return;
  }

  ctx.entities().forEach((e) => {
    if (e.type === "url") {
      const url = new URL(e.text);
      sendTweet(url);
    } else if (e.type === "text_link") {
      const url = new URL(e.url);
      sendTweet(url);
    }
  });
}
