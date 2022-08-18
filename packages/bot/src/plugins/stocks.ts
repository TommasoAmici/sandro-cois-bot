import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";

import axios from "axios";
import config from "../config";

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

const searchURL = (ticker: string) =>
  `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${config.alphaVantageToken}`;

const formatSearch = (globalQuote: StocksSearch[]) =>
  globalQuote
    .map(g => `${g["1. symbol"]}, ${g["2. name"]}, ${g["4. region"]}`)
    .join("\n");

const search = (ctx: HearsContext<Context>) => {
  axios
    .get<AlphaVantageResponse>(searchURL(ctx.match[2].toUpperCase()))
    .then(res => ctx.reply(formatSearch(res.data["bestMatches"])))
    .catch(err => console.error(err));
};

interface GlobalQuote {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
}

interface AlphaVantageResponse {
  "Global Quote": GlobalQuote;
}

const quoteURL = (ticker: string) =>
  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${config.alphaVantageToken}`;

const formatQuote = (globalQuote: GlobalQuote) =>
  `${globalQuote["01. symbol"]}\n${globalQuote["05. price"]}\n${
    Number(globalQuote["10. change percent"].replace("%", "")) > 0
      ? "📈 "
      : "📉 "
  }${globalQuote["10. change percent"]}`;

const quote = (ctx: HearsContext<Context>) =>
  axios
    .get<AlphaVantageResponse>(quoteURL(ctx.match[2].toUpperCase()))
    .then(res => ctx.reply(formatQuote(res.data["Global Quote"])))
    .catch(err => console.error(err));

export const stocks = new Composer();
stocks.hears(/^[/!](stonks|stocks|borsa)(?:@\w+)? (\w*\.\w*)$/i, quote);
stocks.hears(
  /^[/!](stonkssearch|stockssearch|borsacerca)(?:@\w+)? (\w+)$/i,
  search,
);
