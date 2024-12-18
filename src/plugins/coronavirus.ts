import type { Context, HearsContext } from "grammy";
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
  const elements = [];
  for (let i = 0; i < k; i++) {
    elements.push(randomChoice(choices));
  }
  return elements.join("");
};
export const coronavirusGago = async (ctx: HearsContext<Context>) => {
  const gagoIndex =
    Number.parseInt(ctx.match[1]) <= 1500 ? +ctx.match[1] : 1500;
  const message = gago(gagoIndex);
  await ctx.reply(message);
};

const covidIndex = (): string => {
  const covidPercentage = (Math.random() * 100).toFixed(2);
  return `Hai il coronavirus con una probabilità del ${covidPercentage}%`;
};

export const coronavirusPercent = async (ctx: HearsContext<Context>) => {
  await ctx.reply(covidIndex());
};
