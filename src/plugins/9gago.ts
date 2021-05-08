import * as TelegramBot from "node-telegram-bot-api";
import utils from "./utils";

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
  "🍆 💦 🍑",
  "🥰",
  "🥳",
  "🤪",
  "😈",
  "🙈",
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
    const gagoIndex = +match[1];
    const message = gago(gagoIndex);
    utils.paginateMessages(bot, msg, message);
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
  },
};
