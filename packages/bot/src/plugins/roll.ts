import { Context, HearsContext } from "grammy";
import { randInt } from "./utils/random";

export const roll = async (ctx: HearsContext<Context>) => {
  let count = parseInt(ctx.match[1]);
  if (count === undefined || count === 0) count = 1;
  if (count >= 1000) count = 1000;

  let sides = parseInt(ctx.match[2]);
  if (sides >= Number.MAX_SAFE_INTEGER) sides = Number.MAX_SAFE_INTEGER;

  if (isNaN(sides)) {
    sides = count;
    count = 1;
  }

  let total = 0;
  let throws = [];
  for (let i = 0; i < count; i++) {
    let val = randInt(1, sides);
    total += val;
    throws.push(val);
  }

  await ctx.reply(`${throws.join(" ")} | Total: ${total}`);
};
