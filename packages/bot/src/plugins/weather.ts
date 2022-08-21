import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import cfg from "../config";

const kToC = (temp: number): string => (temp - 273.15).toFixed(1);

const conditionsEmojis = {
  Clear: "☀️",
  Thunderstorm: "⛈",
  Drizzle: "🌧",
  Rain: "☔️",
  Snow: "☃️",
  Atmosphere: "🌫",
  Mist: "🌫",
  Fog: "🌫",
  Clouds: "☁️",
};

const getEmoji = (condition: string): string => conditionsEmojis[condition];

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray): Promise<void> => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const query = match[1]; // the captured "whatever"

    // https://openweathermap.org/current
    const baseApi = "https://api.openweathermap.org/data/2.5/weather";

    const params = new URLSearchParams({
      q: query,
      APPID: cfg.openWeatherToken,
    });
    const url = `${baseApi}?${params.toString()}`;

    try {
      const response = await request(url);
      const data = await response.body.json();

      if (!data.weather || data.weather.length === 0) {
        bot.sendMessage(msg.chat.id, `Couldn't find the weather for ${query}`);
      } else {
        const conditionsEmoji = getEmoji(data.weather[0].main);
        const message = `The temperature in ${data.name} is ${kToC(
          data.main.temp,
        )}°C\nCurrent conditions are: ${
          data.weather[0].description
        } ${conditionsEmoji}`;
        bot.sendMessage(msg.chat.id, message);
      }
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        bot.sendMessage(msg.chat.id, error.response.status);
      }
      console.error(error.response);
    }
  };
