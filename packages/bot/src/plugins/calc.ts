import { Context, HearsContext } from "grammy";
import { evaluate } from "mathjs";

export const calculator = async (ctx: HearsContext<Context>) => {
  try {
    const evaluated = evaluate(ctx.match[1]);
    if (typeof evaluated === "object") {
      // handle conversions
      if (ctx.match[1].includes(" to ")) {
        await ctx.reply(
          `${evaluated.value / evaluated.units[0].unit.value} ${
            evaluated.units[0].unit.name
          }`,
        );
      }
      // handle calcs with different units
      else {
        await ctx.reply(
          `${evaluated.value / evaluated.units[0].prefix.value} ${
            evaluated.units[0].prefix.name
          }${evaluated.units[0].unit.name}`,
        );
      }
    }
    // numerical expression needs no handling
    else {
      await ctx.reply(evaluated);
    }
  } catch (error) {
    await ctx.reply("🤷🏻‍♂️");
  }
};
