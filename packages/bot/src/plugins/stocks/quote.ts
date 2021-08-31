import axios from "axios";
import * as TelegramBot from "node-telegram-bot-api";
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

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    axios
      .get(url(match[2].toUpperCase()))
      .then((res: { data: AlphaVantageResponse }) =>
        bot.sendMessage(msg.chat.id, makeString(res.data["Global Quote"]))
      )
      .catch((err) => console.error(err));
  };
