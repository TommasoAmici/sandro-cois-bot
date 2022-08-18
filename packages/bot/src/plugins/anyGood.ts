import type { Context, HearsContext } from "grammy";
import { randomChoice } from "./utils/random";

const cannedReplies = ["Sì", "No"];

export const anyGood = async (ctx: HearsContext<Context>) =>
  ctx.reply(randomChoice(cannedReplies));
