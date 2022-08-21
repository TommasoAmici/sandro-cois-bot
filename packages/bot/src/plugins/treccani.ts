import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import { paginateMessages } from "./utils";

const baseURL = "https://www.treccani.it";

const getDetailURL = async (word: string) => {
  const listURL = `${baseURL}/vocabolario/ricerca/${word}/`;
  const res = await request(listURL);
  const text = await res.body.text();

  if (res.statusCode === 404 || text === "") {
    return undefined;
  }

  const root = parse(text);
  const firstDefinition = root.querySelector(
    "section.module-article-search_preview",
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
      const res = await request(detailURL);
      const text = await res.body.text();
      const root = parse(text);
      const section = root.querySelector("div.text.spiega");
      paginateMessages(bot, msg, section.rawText);
    } else {
      bot.sendMessage(msg.chat.id, "Non ho trovato niente");
    }
  };
