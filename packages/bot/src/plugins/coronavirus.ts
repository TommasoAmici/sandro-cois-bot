import TelegramBot from "node-telegram-bot-api";
import { randomChoice } from "./utils/random";

const choices = [
  "😷",
  "🤒",
  "🤧",
  "😰",
  "👨‍🔬",
  "👩‍🔬",
  "🙏",
  "💦",
  "🚑",
  "🏥",
  "💉",
  "💊",
  "🌡",
  "🔬",
  "🆘",
  "☣",
  "️🇮🇹",
  "🇨🇳",
  "🇮🇷",
  "🇪🇸",
  "👑",
  "🦠",
];

const gago = (k: number): string => {
  let elements = [];
  for (let i = 0; i < k; i++) {
    elements.push(randomChoice(choices));
  }
  return elements.join("");
};

const covidIndex = (): string => {
  const covidPercentage = (Math.random() * 100).toFixed(2);
  return `Hai il coronavirus con una probabilità del ${covidPercentage}%`;
};

export default {
  gago:
    (bot: TelegramBot) =>
    (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
      const gagoIndex = +match[1] <= 1500 ? +match[1] : 1500;
      const message = gago(gagoIndex);
      bot.sendMessage(msg.chat.id, message);
    },
  percent:
    (bot: TelegramBot) =>
    (msg: TelegramBot.Message): void => {
      bot.sendMessage(msg.chat.id, covidIndex());
    },
};
