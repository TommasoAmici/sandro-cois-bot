import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    try {
      bot.setChatTitle(msg.chat.id, match[1]);
    } catch {
      bot.sendMessage(msg.chat.id, "You're not an admin :(");
    }
  };
