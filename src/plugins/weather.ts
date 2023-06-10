import { Context, HearsContext } from "grammy";

import cfg from "@/config";

type WeatherResponse =
  | {
      cod: string;
      message: string;
    }
  | {
      coord: {
        lon: number;
        lat: number;
      };
      weather: {
        id: number;
        main: "Clear" | ({} & string);
        description: "clear sky" | ({} & string);
        icon: "01d" | ({} & string);
      }[];
      base: "stations" | ({} & string);
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
      };
      visibility: number;
      wind: {
        speed: number;
        deg: number;
      };
      clouds: {
        all: number;
      };
      dt: number;
      sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
      };
      timezone: number;
      id: number;
      name: string;
      cod: number;
    };

const kToC = (temp: number): string => (temp - 273.15).toFixed(1);

const conditionsEmojis: Record<string, string> = {
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
  if (!cfg.openWeatherToken) {
    console.warn("OPENWEATHER_TOKEN missing");
    return;
  }
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const query = ctx.match[1]; // the captured "whatever"

  // https://openweathermap.org/current
  const baseApi = "https://api.openweathermap.org/data/2.5/weather";

  const params = new URLSearchParams({
    q: query,
    APPID: cfg.openWeatherToken,
  });
  const url = `${baseApi}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json<WeatherResponse>();

    if (
      response.status === 404 ||
      !("weather" in data) ||
      data.weather.length === 0
    ) {
      await ctx.reply(`Couldn't find the weather for ${query}`);
    } else {
      const conditionsEmoji = getEmoji(data.weather[0].main);
      const message = `The temperature in ${data.name} is ${kToC(
        data.main.temp,
      )}°C\nCurrent conditions are: ${
        data.weather[0].description
      } ${conditionsEmoji}`;
      await ctx.reply(message);
    }
  } catch (error) {
    await ctx.reply("Error :(");
    console.error(error);
  }
};
