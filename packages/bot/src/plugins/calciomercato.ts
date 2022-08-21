import axios from "axios";
import { decode } from "html-entities";
import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import { randomChoice } from "./utils/random";

const url =
  "https://www.calciomercato.com/api/articles.html?limit=36&favourite_team=mercato&articleType=categoryNews";

const calcioMercato = (bot: TelegramBot, msg: TelegramBot.Message) =>
  axios
    .get<any>(url)
    .then(res => {
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
      bot.sendMessage(msg.chat.id, `${text}\n${href}`, {
        parse_mode: "HTML",
      });
    })
    .catch(e => bot.sendMessage(msg.chat.id, "🤷🏻‍♂️"));

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

const gazzetta = async (bot: TelegramBot, msg: TelegramBot.Message) => {
  const res = await request(gazzettaURL);
  const { data }: GazzettaResponse = await res.body.json();
  const article = randomChoice(data);
  const articleString = prepareString(article);
  bot.sendMessage(msg.chat.id, articleString, {
    parse_mode: "Markdown",
  });
};

const providers = [gazzetta, calcioMercato];

export default (bot: TelegramBot) => (msg: TelegramBot.Message) => {
  const provider = randomChoice(providers);
  provider(bot, msg);
};
