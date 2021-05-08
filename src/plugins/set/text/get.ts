import * as TelegramBot from "node-telegram-bot-api";
import client from "../../../redisClient";
import { Media } from "../../../main";

export default (bot: TelegramBot, media: Media) => async (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): Promise<void> => {
  // store every message to generate markov chains
  const hkey = `chat:${msg.chat.id}:${media.type}`;
  const key = match[0];
  const message = await client.hget(hkey, key);

  if (message && message.length !== 0) {
    bot.sendMessage(msg.chat.id, message);
  }
};
