import TelegramBot from "node-telegram-bot-api";

/**
 * Removes query parameters from twitter.com URLs to fix the preview in telegram
 */
export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    const url = new URL(msg.text);
    if (url.search === "") {
      return;
    }
    url.search = "";
    url.hostname = "vxtwitter.com";
    bot.sendMessage(msg.chat.id, url.toString());
  };
