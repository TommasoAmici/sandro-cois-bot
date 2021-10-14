import axios from "axios";
import { parse } from "node-html-parser";
import * as TelegramBot from "node-telegram-bot-api";
import utils from "./utils";

const baseURL = "http://www.treccani.it";

const getDetailURL = async (word: string) => {
  const listURL = `${baseURL}/vocabolario/ricerca/${word}`;
  const res = await axios.get<string>(listURL);
  if (res.status === 404) return undefined;
  const root = parse(res.data);
  const firstDefinition = root.querySelector(
    "section.module-article-search_preview"
  );
  const wordURL = firstDefinition
    .querySelector("h2 a")
    .removeWhitespace()
    .getAttribute("href");
  const detailURL = `${baseURL}${wordURL}`;
  return detailURL;
};

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray): Promise<void> => {
    const detailURL = await getDetailURL(match[1]);

    if (detailURL !== undefined) {
      const res = await axios.get<string>(detailURL);
      const root = parse(res.data);
      const section = root.querySelector("div.text.spiega");
      utils.paginateMessages(bot, msg, section.rawText);
    } else {
      bot.sendMessage(msg.chat.id, "Non ho trovato niente");
    }
  };
