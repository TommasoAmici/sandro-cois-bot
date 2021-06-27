import * as TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    if (msg.reply_to_message.text && msg.reply_to_message.text.length !== 0) {
      const quote = msg.reply_to_message.text;
      const key = `chat:${msg.chat.id}:quotes`;
      const res = await client.srem(key, quote);

      if (!res) {
        bot.sendMessage(msg.chat.id, "Couldn't remove quote :(");
      } else {
        bot.sendMessage(msg.chat.id, "Quote removed!");
      }
    }
  };
