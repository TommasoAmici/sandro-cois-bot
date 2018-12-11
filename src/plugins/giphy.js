const axios = require("axios");
const utils = require("./utils");
const cfg = require("../config");

module.exports = bot => async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const query = match[1]; // the captured "whatever"

  const baseApi = "https://api.giphy.com/v1/gifs/search";

  const params = {
    q: query,
    limit: 20,
    api_key: cfg.giphyToken,
    rating: "R",
    lang: "it"
  };

  try {
    const response = await axios.get(baseApi, { params });

    if (!response.data.data || response.data.data.length === 0) {
      bot.sendMessage("No gif found.");
    } else {
      const item = utils.randomChoice(response.data.data);
      bot.sendVideo(msg.chat.id, item.images.original.mp4);
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      bot.sendMessage(msg.chat.id, error.response.status);
    }
    console.error(error.response);
  }
};
