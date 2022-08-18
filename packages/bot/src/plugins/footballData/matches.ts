import type { Context, HearsContext } from "grammy";
import { randomChoice } from "../utils/random";
import { Match, Matches, Team } from "./types";
import { api, getCurrMatchday, overrideTeamNames, refereeRoles } from "./utils";

const getTeamName = (t: Team): string => overrideTeamNames[t.id] ?? t.name;

const longestTeamName = (matches: Match[], key: "homeTeam" | "awayTeam") =>
  Math.max(...matches.map(m => getTeamName(m[key]).length));

const formatTeam = (t: Team, pad = 11) => getTeamName(t).padEnd(pad, " ");

const randomRefereeEmoji = () => randomChoice(["🧛‍♂️", "👮‍♂️", "👨‍🦯"]);

const makeMatchesString = async (
  currentMatchday: number,
  competitionCode: string,
  referees: boolean,
): Promise<string> => {
  const params = { matchday: currentMatchday };
  const res = await api.get<Matches>(
    `/competitions/${competitionCode}/matches/`,
    { params },
  );
  const data = res.data;
  const padHomeTeam = longestTeamName(data.matches, "homeTeam");
  const padAwayTeam = longestTeamName(data.matches, "awayTeam");
  const matchesStrings = data.matches.map(m => {
    const homeTeam = formatTeam(m.homeTeam, padHomeTeam);
    const awayTeam = formatTeam(m.awayTeam, padAwayTeam);
    const homeTeamScore =
      m.score.fullTime.homeTeam === null ? " " : m.score.fullTime.homeTeam;
    const awayTeamScore =
      m.score.fullTime.awayTeam === null ? " " : m.score.fullTime.awayTeam;
    const match = `${homeTeam} ${homeTeamScore}-${awayTeamScore} ${awayTeam}`;
    const date = new Date(m.utcDate).toLocaleString("it-IT");
    const output = `\`${match} ${date}\``;
    if (referees) {
      const refs = m.referees
        .map(r => `${r.name} ${refereeRoles[r.role] ?? r.role}`)
        .join(", ");
      const refsString =
        refs !== "" ? `\n${randomRefereeEmoji()} Arbitri: ${refs}` : "";
      return `${output}${refsString}\n`;
    } else {
      return output;
    }
  });
  return `*Giornata ${currentMatchday}*\n\n${matchesStrings.join("\n")}`;
};

export default (offset = 0, referees = false) =>
  async (ctx: HearsContext<Context>) => {
    const competitionCode = (ctx.match[1] ?? "SA").toUpperCase();
    const currentMatchday = await getCurrMatchday(competitionCode);
    if (currentMatchday === 0) ctx.reply("Boh 🤷🏻‍♂️");
    else {
      try {
        const matchesString = await makeMatchesString(
          currentMatchday + offset,
          competitionCode,
          referees,
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
