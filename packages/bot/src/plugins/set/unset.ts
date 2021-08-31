import * as TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";

export default (bot: TelegramBot, media: Media) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    const key = match[1];
    const hkey = `chat:${msg.chat.id}:${media.type}`;

    client
      .hdel(hkey, key)
      .then((res) => bot.sendMessage(msg.chat.id, `Unset ${key}!`))
      .catch((err) =>
        bot.sendMessage(msg.chat.id, `Couldn't unset ${key} :()`)
      );
  };
