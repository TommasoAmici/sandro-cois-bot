import utils from "./utils";
import * as TelegramBot from "node-telegram-bot-api";

const choices = [
  "😍",
  "🍆 💦 😫",
  "👌😂",
  "💯 ",
  "🔝 ",
  " ",
  "😂😂😂",
  " gago ",
  "🤔",
  "👏",
  "🙏",
  "🍆 💦 🍑"
];

const gago = (k: number): string => {
  let elements = [];
  for (let i = 0; i < k; i++) {
    elements.push(utils.randomChoice(choices));
  }
  return elements.join("");
};

export default {
  numeric: (bot: TelegramBot) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
  ): void => {
    const gagoIndex = +match[1] <= 1500 ? +match[1] : 1500;
    const message = gago(gagoIndex);
    bot.sendMessage(msg.chat.id, message);
  },
  alpha: (bot: TelegramBot) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
  ): void => {
    const message = "😂".repeat((match[0].length - 1) / 4);
    bot.sendMessage(msg.chat.id, message);
  },
  evil: (bot: TelegramBot) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
  ): void => {
    const message = "😡".repeat((match[0].length - 1) / 8);
    bot.sendMessage(msg.chat.id, message);
  }
};
