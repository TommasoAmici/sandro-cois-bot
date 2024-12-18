import type { Context, HearsContext } from "grammy";
import type { Standings } from "./types";
import { apiGet, getCurrMatchday, overrideTeamNames } from "./utils";

const makeMatchesString = async (
  currentMatchday: number,
  competitionCode: string,
) => {
  const res = await apiGet(
    `/competitions/${competitionCode}/standings/?matchday=${currentMatchday}`,
  );
  const data: Standings = await res.json();
  const padEnd = data.standings[0].table
    .map((t) => overrideTeamNames[t.team.id] ?? t.team.name)
    .sort((a, b) => b.length - a.length)[0].length;
  const standingsStrings = data.standings[0].table.map(
    (t) =>
      `${String(t.position).padStart(2, " ")} ${(
        overrideTeamNames[t.team.id] ?? t.team.name
      ).padEnd(Math.max(15, padEnd), " ")} ${String(t.points).padStart(
        2,
        " ",
      )}`,
  );
  return `*Giornata ${currentMatchday}*\n\n\`${standingsStrings.join("\n")}\``;
};

export default async (ctx: HearsContext<Context>) => {
  const competitionCode = (ctx.match[1] ?? "SA").toUpperCase();
  const currentMatchday = await getCurrMatchday(competitionCode);
  if (currentMatchday === 0) {
    await ctx.reply("Boh 🤷🏻‍♂️");
  } else {
    try {
      const matchesString = await makeMatchesString(
        currentMatchday,
        competitionCode,
      );
      await ctx.reply(matchesString, {
        parse_mode: "MarkdownV2",
      });
    } catch (error) {
      await ctx.reply("Error :(");
      console.error(error);
    }
  }
};
