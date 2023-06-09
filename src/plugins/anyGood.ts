import { Context, HearsContext } from "grammy";
import { randomChoice } from "./utils/random";

const cannedReplies = ["Sì", "No"];

export const anyGood = async (ctx: HearsContext<Context>) => {
  await ctx.reply(randomChoice(cannedReplies));
};
