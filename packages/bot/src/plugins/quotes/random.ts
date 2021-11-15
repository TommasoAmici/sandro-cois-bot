import TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";
import { formatQuote, IQuote } from "./get";

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const key = `chat:${msg.chat.id}:quotes`;
    const quoteID = await client.send_command("ZRANDMEMBER", key);
    client.hgetall(`${key}:${quoteID}`, (err, record) => {
      if (err) {
        console.error(err);
        bot.sendMessage(msg.chat.id, "Something went wrong :(");
      } else {
        const formattedQuote = formatQuote(record as unknown as IQuote);
        bot.sendMessage(msg.chat.id, formattedQuote);
      }
    });
  };
