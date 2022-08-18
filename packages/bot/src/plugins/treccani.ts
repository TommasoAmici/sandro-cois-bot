import axios from "axios";
import { Context, HearsContext } from "grammy";
import { parse } from "node-html-parser";
import utils from "./utils";

const baseURL = "http://www.treccani.it";

const getDetailURL = async (word: string) => {
  const listURL = `${baseURL}/vocabolario/ricerca/${word}`;
  const res = await axios.get<string>(listURL);
  if (res.status === 404) return undefined;
  const root = parse(res.data);
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

export const treccani = async (ctx: HearsContext<Context>) => {
  const detailURL = await getDetailURL(ctx.match[1]);

  if (detailURL !== undefined) {
    const res = await axios.get<string>(detailURL);
    const root = parse(res.data);
    const section = root.querySelector("div.text.spiega");
    utils.paginateMessages(ctx, section.rawText);
  } else {
    ctx.reply("Non ho trovato niente");
  }
};
