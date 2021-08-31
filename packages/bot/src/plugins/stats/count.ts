import * as TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";

export default () =>
  (msg: TelegramBot.Message): void => {
    const key = `chat:${msg.chat.id}:user:${msg.from.id}`;
    client.hincrby(key, "stats", 1).then((stats: Number) => {
      if (stats === 1) client.hset(key, "name", msg.from.username);
    });
  };
