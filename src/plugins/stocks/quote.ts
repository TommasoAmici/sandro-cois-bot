import { Context, HearsContext } from "grammy";
import config from "../../config";

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

const url = (ticker: string) =>
  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${config.alphaVantageToken}`;

const makeString = (globalQuote: GlobalQuote) =>
  `${globalQuote["01. symbol"]}\n${globalQuote["05. price"]}\n${
    Number(globalQuote["10. change percent"].replace("%", "")) > 0
      ? "📈 "
      : "📉 "
  }${globalQuote["10. change percent"]}`;

export default async (ctx: HearsContext<Context>) => {
  const ticker = ctx.match[2].toUpperCase();

  const res = await fetch(url(ticker));
  const data: AlphaVantageResponse = await res.json();
  await ctx.reply(makeString(data["Global Quote"]));
};
