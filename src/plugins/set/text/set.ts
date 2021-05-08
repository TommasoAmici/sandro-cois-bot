import * as TelegramBot from "node-telegram-bot-api";
import { Media } from "../../../main";
import client from "../../../redisClient";

export default (bot: TelegramBot, media: Media) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  const key = match[1];
  const val = match[2];

  const hkey = `chat:${msg.chat.id}:${media.type}`;

  client.hset(hkey, key, val, (err, res) => {
    if (err) {
      bot.sendMessage(msg.chat.id, `Couldn't set ${key} :(`);
    } else {
      const message = `${key} => ${val}`;
      bot.sendMessage(msg.chat.id, message);
    }
  });
};
