import { parse } from "node-html-parser";

import { Context, HearsContext } from "grammy";
import { paginateMessages } from "./utils";

const baseURL = "https://www.treccani.it";

const getDetailURL = async (word: string) => {
  const listURL = `${baseURL}/vocabolario/ricerca/${word}/`;
  const res = await fetch(listURL);
  const text = await res.text();

  if (res.status === 404 || text === "") {
    return undefined;
  }

  const root = parse(text);
  const firstDefinition = root.querySelector(
    "section.module-article-search_preview",
  );
  const wordURL = firstDefinition
    ?.querySelector("h2 a")
    ?.removeWhitespace()
    .getAttribute("href");
  if (wordURL === undefined) {
    return undefined;
  }

  const detailURL = `${baseURL}${wordURL}`;
  return detailURL;
};

export const treccani = async (ctx: HearsContext<Context>): Promise<void> => {
  const detailURL = await getDetailURL(ctx.match[1]);

  if (detailURL !== undefined) {
    const res = await fetch(detailURL);
    const text = await res.text();
    const root = parse(text);
    const section = root.querySelector("div.text.spiega");
    await paginateMessages(ctx, section?.rawText);
  } else {
    await ctx.reply("Non ho trovato niente");
  }
};
