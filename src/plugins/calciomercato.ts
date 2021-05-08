import axios from "axios";
import { decode } from "html-entities";
import { parse } from "node-html-parser";
import * as TelegramBot from "node-telegram-bot-api";
import utils from "./utils";

const url =
  "https://www.calciomercato.com/api/articles.html?limit=36&favourite_team=mercato&articleType=categoryNews";

const calcioMercato = (bot: TelegramBot, msg: TelegramBot.Message) =>
  axios
    .get(url)
    .then((res) => {
      const article = utils.randomChoice(
        (parse(res.data).childNodes as any[]).filter(
          (a: any) => a.tagName === "article"
        )
      );
      const item = article
        .querySelector(".news-item__extract")
        .removeWhitespace();
      const href = item.attributes.href;
      const text = decode(item.childNodes[0].rawText);
      bot.sendMessage(msg.chat.id, `${text}\n${href}`, {
        parse_mode: "HTML",
      });
    })
    .catch((e) => bot.sendMessage(msg.chat.id, "🤷🏻‍♂️"));

const gazzettaUrl =
  "https://components2.gazzettaobjects.it/rcs_gaz_searchapi/v1/latest.json";

const includesCalcio = (arr: string[]): boolean => {
  for (const a of arr) {
    if (a.toLowerCase().includes("calcio")) return true;
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

const gazzetta = (bot: TelegramBot, msg: TelegramBot.Message) =>
  axios
    .get(gazzettaUrl)
    .then((res) => {
      const calcioArticles = res.data.response.docs.filter((d: Article) =>
        includesCalcio(d.section)
      ) as Article[];
      const article = utils.randomChoice(calcioArticles);
      const articleString = prepareString(article);
      bot.sendMessage(msg.chat.id, articleString, {
        parse_mode: "Markdown",
      });
    })
    .catch((e) => bot.sendMessage(msg.chat.id, "🤷🏻‍♂️"));

const providers = [gazzetta, calcioMercato];

export default (bot: TelegramBot) => (msg: TelegramBot.Message) => {
  const provider = utils.randomChoice(providers);
  provider(bot, msg);
};
