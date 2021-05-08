import * as TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";

export default (bot: TelegramBot) => async (
  msg: TelegramBot.Message
): Promise<void> => {
  const key = `chat:${msg.chat.id}:quotes`;
  const quote = await client.srandmember(key);
  bot.sendMessage(msg.chat.id, quote);
};
