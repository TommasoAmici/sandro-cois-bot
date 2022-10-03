import TelegramBot from "node-telegram-bot-api";

/**
 * Removes query parameters from twitter.com URLs to fix the preview in telegram
 */
export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    const sendTweet = (url: URL) => {
      if (url.host === "twitter.com") {
        url.search = "";
        url.hostname = "vxtwitter.com";
        bot.sendMessage(msg.chat.id, url.toString());
      }
    };

    msg.entities?.forEach(e => {
      if (e.type === "url") {
        const url = new URL(msg.text.slice(e.offset, e.offset + e.length));
        sendTweet(url);
      } else if (e.type === "text_link") {
        const url = new URL(e.url);
        sendTweet(url);
      }
    });
  };
