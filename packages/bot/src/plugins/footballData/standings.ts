import TelegramBot from "node-telegram-bot-api";
import { Standings } from "./types";
import { api, getCurrMatchday, overrideTeamNames } from "./utils";

const makeMatchesString = async (
  currentMatchday: number,
  competitionCode: string
): Promise<string> => {
  const params = { matchday: currentMatchday };
  const data = await api.get<Standings>(
    `/competitions/${competitionCode}/standings/`,
    { params }
  );
  const standings = data.data;
  const standingsStrings = standings.standings[0].table.map(
    (t) =>
      `${String(t.position).padStart(2, " ")} ${(
        overrideTeamNames[t.team.id] ?? t.team.name
      ).padEnd(15, " ")} ${String(t.points).padStart(2, " ")}`
  );
  return `*Giornata ${currentMatchday}*\n\n\`${standingsStrings.join("\n")}\``;
};

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray): Promise<void> => {
    const competitionCode = (match[1] ?? "SA").toUpperCase();
    const currentMatchday = await getCurrMatchday(competitionCode);
    if (currentMatchday === 0) bot.sendMessage(msg.chat.id, "Boh 🤷🏻‍♂️");
    else {
      try {
        const matchesString = await makeMatchesString(
          currentMatchday,
          competitionCode
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
