import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    const nsfw =
      "NSFW\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nNSFW";
    bot.sendMessage(msg.chat.id, nsfw);
  };
