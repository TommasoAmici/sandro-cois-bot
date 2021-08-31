import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    if (msg.reply_to_message) {
      bot.sendMessage(msg.chat.id, msg.reply_to_message.text.toUpperCase());
    }
  };
