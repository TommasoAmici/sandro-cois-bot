import type { Context, HearsContext } from "grammy";
import { Standings } from "./types";
import { api, getCurrMatchday, overrideTeamNames } from "./utils";

const makeMatchesString = async (
  currentMatchday: number,
  competitionCode: string,
): Promise<string> => {
  const params = { matchday: currentMatchday };
  const data = await api.get<Standings>(
    `/competitions/${competitionCode}/standings/`,
    { params },
  );
  const standings = data.data;
  const padEnd = standings.standings[0].table
    .map(t => overrideTeamNames[t.team.id] ?? t.team.name)
    .sort((a, b) => b.length - a.length)[0].length;
  const standingsStrings = standings.standings[0].table.map(
    t =>
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
    ctx.reply("Boh 🤷🏻‍♂️");
  } else {
    try {
      const matchesString = await makeMatchesString(
        currentMatchday,
        competitionCode,
      );
      ctx.reply(matchesString, {
        parse_mode: "Markdown",
      });
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        ctx.reply(error.response.status);
      }
      console.error(error.response);
    }
  }
};
