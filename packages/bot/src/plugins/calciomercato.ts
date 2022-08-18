import axios from "axios";
import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";
import { decode } from "html-entities";
import { parse } from "node-html-parser";
import { randomChoice } from "./utils/random";

const url =
  "https://www.calciomercato.com/api/articles.html?limit=36&favourite_team=mercato&articleType=categoryNews";

const calcioMercatoCom = (ctx: HearsContext<Context>) =>
  axios.get<any>(url).then(res => {
    const article = randomChoice(
      (parse(res.data).childNodes as any[]).filter(
        (a: any) => a.tagName === "article",
      ),
    );
    const item = article
      .querySelector(".news-item__extract")
      .removeWhitespace();
    const href = item.attributes.href;
    const text = decode(item.childNodes[0].rawText);
    ctx.reply(`${text}\n${href}`, {
      parse_mode: "HTML",
    });
  });

const gazzettaUrl =
  "https://components2.gazzettaobjects.it/rcs_gaz_searchapi/v1/latest.json";

const includesCalcio = (arr: string[]): boolean => {
  for (const a of arr) {
    if (a.toLowerCase().includes("calcio")) {
      return true;
    }
  }
  return false;
};

interface Article {
  image: string;
  standFirst: string;
  section: string[];
  url: string;
  headline: string;
  [propsName: string]: string | string[];
}

const prepareString = (article: Article): string =>
  `*${article.headline}*\n${article.standFirst}\n\n${article.url}`;

const gazzetta = (ctx: HearsContext<Context>) =>
  axios.get<any>(gazzettaUrl).then(res => {
    const calcioArticles = res.data.response.docs.filter((d: Article) =>
      includesCalcio(d.section),
    ) as Article[];
    const article = randomChoice(calcioArticles);
    const articleString = prepareString(article);
    ctx.reply(articleString, {
      parse_mode: "Markdown",
    });
  });

const providers = [gazzetta, calcioMercatoCom];

export const calcioMercato = new Composer();
calcioMercato.hears(/^[/!](calciomercato|cm)(?:@\w+)?$/i, ctx => {
  const provider = randomChoice(providers);
  provider(ctx);
});
