import * as TelegramBot from "node-telegram-bot-api";
import { Standings } from "./types";
import { api, getCurrMatchday, teams } from "./utils";

const makeMatchesString = async (currentMatchday: number): Promise<string> => {
  const params = { matchday: currentMatchday };
  const data = await api.get("/competitions/SA/standings/", { params });
  const standings: Standings = data.data;
  const standingsStrings = standings.standings[0].table.map(
    (t) =>
      `${String(t.position).padStart(2, " ")} ${teams[t.team.id].padEnd(
        15,
        " "
      )} ${String(t.points).padStart(2, " ")}`
  );
  return `*Giornata ${currentMatchday}*\n\n\`${standingsStrings.join("\n")}\``;
};

export default (bot: TelegramBot) => async (
  msg: TelegramBot.Message
): Promise<void> => {
  const currentMatchday = await getCurrMatchday();
  if (currentMatchday === 0) bot.sendMessage(msg.chat.id, "Boh 🤷🏻‍♂️");
  else {
    try {
      const matchesString = await makeMatchesString(currentMatchday);
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
