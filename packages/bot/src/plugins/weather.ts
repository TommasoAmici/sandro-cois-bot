import axios from "axios";
import type { Context, HearsContext } from "grammy";
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

export const weather = async (ctx: HearsContext<Context>) => {
  const q = ctx.match[1];

  // https://openweathermap.org/current
  const baseApi = "https://api.openweathermap.org/data/2.5/weather";

  const params = { q, APPID: cfg.openWeatherToken };

  try {
    const response = await axios.get<any>(baseApi, { params });

    if (!response.data.weather || response.data.weather.length === 0) {
      ctx.reply(`Couldn't find the weather for ${q}`);
    } else {
      const conditionsEmoji = getEmoji(response.data.weather[0].main);
      const message = `The temperature in ${response.data.name} is ${kToC(
        response.data.main.temp,
      )}°C\nCurrent conditions are: ${
        response.data.weather[0].description
      } ${conditionsEmoji}`;
      ctx.reply(message);
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      ctx.reply(error.response.status);
    }
    console.error(error.response);
  }
};
