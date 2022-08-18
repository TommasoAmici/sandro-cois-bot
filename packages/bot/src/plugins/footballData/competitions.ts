import type { Context, HearsContext } from "grammy";
import { Competition } from "./types";
import { api } from "./utils";

/**
 * Returns a list of football competitions with their name and code
 */
export default async (ctx: HearsContext<Context>) => {
  const res = await api.get<{
    count: number;
    filters: Object;
    competitions: Competition[];
  }>("/competitions/");
  const competitions = res.data.competitions;
  ctx.reply(
    competitions
      .filter(c => c.plan === "TIER_ONE")
      .map(c => `${c.code} - ${c.name}`)
      .join("\n"),
    {
      parse_mode: "Markdown",
    },
  );
};
