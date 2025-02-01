import { middlewareFactory } from "@/middleware";
import { Composer, type Context } from "grammy";

const URLS_TO_MAP = new Set(["instagram.com"]);

/**
 * Removes query parameters from URLs to fix the preview in telegram
 */
async function instagramPreview(ctx: Context) {
  async function sendMsg(url: URL) {
    if (URLS_TO_MAP.has(url.host)) {
      url.search = "";
      url.hostname = "ddinstagram.com";
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
      await sendMsg(url);
    } else if (entity.type === "text_link") {
      const url = new URL(entity.url);
      await sendMsg(url);
    }
  }
}

export const instagramComposer = new Composer();
instagramComposer.on("message", middlewareFactory(instagramPreview));
