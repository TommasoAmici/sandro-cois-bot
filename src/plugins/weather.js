const axios = require("axios");
const cfg = require("../config");

const kToC = temp => (temp - 273.15).toFixed(1);

const conditionsEmojis = {
  Clear: "☀️",
  Thunderstorm: "⛈",
  Drizzle: "🌧",
  Rain: "☔️",
  Snow: "☃️",
  Atmosphere: "🌫 ",
  Clouds: "☁️"
};

const getEmoji = condition => conditionsEmojis[condition];

module.exports = bot => async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const query = match[1]; // the captured "whatever"

  // https://openweathermap.org/current
  const baseApi = "https://api.openweathermap.org/data/2.5/weather";

  const params = {
    q: query,
    APPID: cfg.openWeatherToken
  };

  try {
    const response = await axios.get(baseApi, { params });

    if (!response.data.weather || response.data.weather.length === 0) {
      bot.sendMessage(`Couldn't find the weather for ${query}`);
    } else {
      const conditionsEmoji = getEmoji(response.data.weather[0].main);
      const message = `The temperature in ${response.data.name} is ${kToC(
        response.data.main.temp
      )}°C\nCurrent conditions are: ${
        response.data.weather[0].description
      } ${conditionsEmoji}`;
      bot.sendMessage(chatId, message);
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      bot.sendMessage(chatId, error.response.status);
    }
    console.error(error.response);
  }
};
