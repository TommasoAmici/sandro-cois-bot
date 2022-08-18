import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";
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

const covidIndex = (): string => {
  const covidPercentage = (Math.random() * 100).toFixed(2);
  return `Hai il coronavirus con una probabilità del ${covidPercentage}%`;
};

const gagoHandler = (ctx: HearsContext<Context>) => {
  const gagoIndex = +ctx.match[1] <= 1500 ? +ctx.match[1] : 1500;
  const message = gago(gagoIndex);
  ctx.reply(message);
};

export const coronavirus = new Composer();
coronavirus.hears(/^[/!](\d+)covid/i, gagoHandler);
coronavirus.hears(/^[/!]covid(\d+)/i, gagoHandler);
coronavirus.hears(/^[/!]covid$/i, ctx => ctx.reply(covidIndex()));
