import * as TelegramBot from "node-telegram-bot-api";
import { Matches } from "./types";
import { api, getCurrMatchday, teams } from "./utils";

const makeMatchesString = async (currentMatchday: number): Promise<string> => {
  const params = { matchday: currentMatchday };
  const data = await api.get<Matches>("/competitions/SA/matches/", { params });
  const matches = data.data;
  const matchesStrings = matches.matches.map(
    (m) =>
      `${teams[m.homeTeam.id].padEnd(10, " ")} ${
        m.score.fullTime.homeTeam === null ? 0 : m.score.fullTime.homeTeam
      }-${m.score.fullTime.awayTeam === null ? 0 : m.score.fullTime.awayTeam} ${
        teams[m.awayTeam.id]
      }`
  );
  return `*Giornata ${currentMatchday}*\n\n\`${matchesStrings.join("\n")}\``;
};

export default (bot: TelegramBot, offset = 0) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const currentMatchday = await getCurrMatchday();
    if (currentMatchday === 0) bot.sendMessage(msg.chat.id, "Boh 🤷🏻‍♂️");
    else {
      try {
        const matchesString = await makeMatchesString(currentMatchday + offset);
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
