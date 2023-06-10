import { db } from "@/database/database";
import { escapeHTML } from "bun";
import { Context, HearsContext } from "grammy";
import { decode } from "html-entities";
import { parse } from "node-html-parser";
import { randomChoice } from "./utils/random";

function storeArticleID(chatID: number, articleID: string) {
  db.run("INSERT INTO calciomercato (chat_id, article_id) VALUES (?, ?)", [
    chatID,
    articleID,
  ]);
}

function checkArticleID(chatID: number, articleID: string): boolean {
  const query = db.query<string, [number, string]>(
    "SELECT article_id FROM calciomercato WHERE chat_id = ? AND article_id = ?",
  );
  const result = query.get(chatID, articleID);
  return result !== null;
}

class CalcioMercato {
  recursionLimit = 10;
  url =
    "https://www.calciomercato.com/api/articles.html?limit=36&favourite_team=mercato&articleType=categoryNews";

  async fetch() {
    const res = await fetch(this.url);
    const data = await res.text();
    const root = parse(data);
    return root.querySelectorAll("article");
  }

  async findArticle(chatID: number) {
    const articles = await this.fetch();
    for (const [index, article] of articles.entries()) {
      if (index > this.recursionLimit) {
        return { id: null, element: null };
      }
      const articleID = article?.attributes["data-id"];
      if (checkArticleID(chatID, articleID)) {
        continue;
      }
      return {
        id: articleID,
        element: article
          ?.querySelector(".news-item__extract")
          ?.removeWhitespace(),
      };
    }
  }

  async message(chatID: number) {
    const article = await this.findArticle(chatID);
    if (article?.id === null) {
      return null;
    }

    if (article?.element) {
      const href = article.element.attributes.href;
      const text = decode(article.element.childNodes[0].rawText);

      return {
        text: `${text}\n${href}`,
        parse_mode: "HTML" as const,
        id: article.id,
      };
    }
  }
}

class Gazzetta {
  recursionLimit = 10;
  url = "https://searchapiservice2.gazzetta.it/api/section/calcio";

  async fetch() {
    const res = await fetch(this.url);
    const { data }: GazzettaResponse = await res.json();
    return data;
  }

  async findArticle(chatID: number) {
    const articles = await this.fetch();
    for (const [index, article] of articles.entries()) {
      if (index > this.recursionLimit) {
        return null;
      }
      const articleID = article.contentId;
      if (checkArticleID(chatID, articleID)) {
        continue;
      }
      return article;
    }
  }

  async message(chatID: number) {
    const article = await this.findArticle(chatID);
    if (article === null || article === undefined) {
      return null;
    }

    const text = `<b>${escapeHTML(article.headline)}</b>\n${escapeHTML(
      article.standFirst,
    )}\n\n${article.url}`;
    return {
      text,
      parse_mode: "HTML" as const,
      id: article.contentId,
    };
  }
}

const providers = [Gazzetta, CalcioMercato];

export async function footballNews(ctx: HearsContext<Context>) {
  const provider = randomChoice(providers);
  const providerInstance = new provider();
  const message = await providerInstance.message(ctx.chat?.id);
  if (message) {
    storeArticleID(ctx.chat?.id, message.id);
    await ctx.reply(message.text, { parse_mode: message.parse_mode });
  } else {
    await ctx.reply("Non ci sono nuove notizie, riprova più tardi.");
  }
}
