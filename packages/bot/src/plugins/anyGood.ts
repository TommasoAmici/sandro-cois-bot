import TelegramBot from "node-telegram-bot-api";
import { randomChoice } from "./utils/random";

const cannedReplies = ["Sì", "No"];

export const anyGood =
  (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    bot.sendMessage(msg.chat.id, randomChoice(cannedReplies));
  };
