import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import config from "../../config";

interface StocksSearch {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
}

interface AlphaVantageResponse {
  bestMatches: StocksSearch[];
}

const url = (ticker: string) =>
  `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${config.alphaVantageToken}`;

const makeString = (globalQuote: StocksSearch[]) =>
  globalQuote
    .map(g => `${g["1. symbol"]}, ${g["2. name"]}, ${g["4. region"]}`)
    .join("\n");

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray) => {
    const ticker = match[2].toUpperCase();
    const res = await request(url(ticker));
    const data: AlphaVantageResponse = await res.body.json();
    bot.sendMessage(msg.chat.id, makeString(data["bestMatches"]));
  };
