import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    bot.sendMessage(msg.chat.id, String(msg.chat.id));
  };
