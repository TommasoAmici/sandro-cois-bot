import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    bot.sendMessage(msg.chat.id, "Basta ultimouomo, maledetto capiscer!", {
      reply_to_message_id: msg.message_id,
    });
  };
