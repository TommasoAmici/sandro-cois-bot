import { paginateMessages } from "@/utils";
import type { Context, HearsContext } from "grammy";
import { randomChoice } from "./utils/random";

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
  const elements = [];
  for (let i = 0; i < k; i++) {
    elements.push(randomChoice(choices));
  }
  return elements.join("");
};

export default {
  numeric: async (ctx: HearsContext<Context>) => {
    const gagoIndex = Number.parseInt(ctx.match[1]);
    const message = gago(gagoIndex);
    await paginateMessages(ctx, message);
  },
  alpha: async (ctx: HearsContext<Context>) => {
    const message = "😂".repeat((ctx.match[0].length - 1) / 4);
    await ctx.reply(message);
  },
  evil: async (ctx: HearsContext<Context>) => {
    const message = "😡".repeat((ctx.match[0].length - 1) / 8);
    await ctx.reply(message);
  },
};
