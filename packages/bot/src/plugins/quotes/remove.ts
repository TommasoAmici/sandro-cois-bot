import * as TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";
import { searchQuotes } from "./get";

const authorDateRegex = /\n*- (.+)( - \d+-\d+-\d+)?$/;

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    if (msg.reply_to_message.text && msg.reply_to_message.text.length !== 0) {
      const quote = msg.reply_to_message.text.replace(authorDateRegex, "");
      const search = await searchQuotes(msg.chat.id, quote, 1);
      if (search.length === 0) {
        bot.sendMessage(msg.chat.id, "Couldn't remove quote :(");
      } else {
        client.zrem(`chat:${msg.chat.id}:quotes`, search[0].id);
        client.del(`chat:${msg.chat.id}:quotes:${search[0].id}`);
        bot.sendMessage(msg.chat.id, "Quote removed!");
      }
    }
  };