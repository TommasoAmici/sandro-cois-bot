import TelegramBot from "node-telegram-bot-api";
import { Competition } from "./types";
import { api } from "./utils";

/**
 * Returns a list of football competitions with their name and code
 */
export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const res = await api.get<{
      count: number;
      filters: Object;
      competitions: Competition[];
    }>("/competitions/");
    const competitions = res.data.competitions;
    bot.sendMessage(
      msg.chat.id,
      competitions
        .filter(c => c.plan === "TIER_ONE")
        .map(c => `${c.code} - ${c.name}`)
        .join("\n"),
      {
        parse_mode: "Markdown",
      },
    );
  };
