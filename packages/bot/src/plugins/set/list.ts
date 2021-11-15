import TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";

export default (bot: TelegramBot, media: Media) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const hkey = `chat:${msg.chat.id}:${media.type}`;
    const allKeys: string[] = await client.hkeys(hkey);
    const list = allKeys.join("\n");
    bot.sendMessage(msg.chat.id, list);
  };
