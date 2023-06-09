import { Context, HearsContext } from "grammy";
import { decode } from "html-entities";
import { parse } from "node-html-parser";
import { randomChoice } from "./utils/random";

const url =
  "https://www.calciomercato.com/api/articles.html?limit=36&favourite_team=mercato&articleType=categoryNews";

const calcioMercato = async (ctx: HearsContext<Context>) => {
  const res = await fetch(url);
  const data = await res.text();

  const article = randomChoice(
    (parse(data).childNodes as any[]).filter(
      (a: any) => a.tagName === "article",
    ),
  );
  const item = article.querySelector(".news-item__extract").removeWhitespace();
  const href = item.attributes.href;
  const text = decode(item.childNodes[0].rawText);
  await ctx.reply(`${text}\n${href}`, {
    parse_mode: "HTML",
  });
};

const gazzettaURL = "https://searchapiservice2.gazzetta.it/api/section/calcio";

interface Article {
  image: string;
  standFirst: string;
  section: string[];
  url: string;
  headline: string;
  [propsName: string]: string | string[];
}

const prepareString = (article: GazzettaArticle): string =>
  `*${article.headline}*\n${article.standFirst}\n\n${article.url}`;

const gazzetta = async (ctx: HearsContext<Context>) => {
  const res = await fetch(gazzettaURL);
  const { data }: GazzettaResponse = await res.json();
  const article = randomChoice(data);
  const articleString = prepareString(article);
  await ctx.reply(articleString, {
    parse_mode: "Markdown",
  });
};

const providers = [gazzetta, calcioMercato];

export default (ctx: HearsContext<Context>) => {
  const provider = randomChoice(providers);
  provider(ctx);
};
