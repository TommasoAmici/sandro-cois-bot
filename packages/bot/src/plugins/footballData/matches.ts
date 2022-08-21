import TelegramBot from "node-telegram-bot-api";
import { randomChoice } from "../utils/random";
import { Match, Matches, Team } from "./types";
import {
  apiGet,
  getCurrMatchday,
  overrideTeamNames,
  refereeRoles,
} from "./utils";

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
  const res = await apiGet(
    `/competitions/${competitionCode}/matches/?matchday=${currentMatchday}`,
  );
  const data: Matches = await res.body.json();
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

export default (bot: TelegramBot, offset = 0, referees = false) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray): Promise<void> => {
    const competitionCode = (match[1] ?? "SA").toUpperCase();
    const currentMatchday = await getCurrMatchday(competitionCode);
    if (currentMatchday === 0) bot.sendMessage(msg.chat.id, "Boh 🤷🏻‍♂️");
    else {
      try {
        const matchesString = await makeMatchesString(
          currentMatchday + offset,
          competitionCode,
          referees,
        );
        bot.sendMessage(msg.chat.id, matchesString, {
          parse_mode: "Markdown",
        });
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          bot.sendMessage(msg.chat.id, error.response.status);
        }
        console.error(error.response);
      }
    }
  };
