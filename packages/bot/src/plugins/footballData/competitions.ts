import { Context, HearsContext } from "grammy";
import { Competition } from "./types";
import { apiGet } from "./utils";

/**
 * Returns a list of football competitions with their name and code
 */
export default async (ctx: HearsContext<Context>) => {
  const res = await apiGet("/competitions/");
  const data: {
    count: number;
    filters: Object;
    competitions: Competition[];
  } = await res.json();
  await ctx.reply(
    data.competitions
      .filter(c => c.plan === "TIER_ONE")
      .map(c => `${c.code} - ${c.name}`)
      .join("\n"),
    {
      parse_mode: "MarkdownV2",
    },
  );
};
