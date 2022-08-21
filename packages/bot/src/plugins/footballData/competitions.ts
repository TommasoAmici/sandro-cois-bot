import TelegramBot from "node-telegram-bot-api";
import { Competition } from "./types";
import { apiGet } from "./utils";

/**
 * Returns a list of football competitions with their name and code
 */
export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const res = await apiGet("/competitions/");
    const data: {
      count: number;
      filters: Object;
      competitions: Competition[];
    } = await res.body.json();
    bot.sendMessage(
      msg.chat.id,
      data.competitions
        .filter(c => c.plan === "TIER_ONE")
        .map(c => `${c.code} - ${c.name}`)
        .join("\n"),
      {
        parse_mode: "Markdown",
      },
    );
  };
