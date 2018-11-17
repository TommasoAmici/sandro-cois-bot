const axios = require("axios");
const querystring = require("querystring");
const utils = require("./utils");
const cfg = require("../config");

module.exports = bot => async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const query = match[1]; // the captured "whatever"

  // from https://cse.google.com/
  const baseApi = "https://www.googleapis.com/customsearch/v1";

  const params = {
    q: query,
    cx: cfg.googleCseToken,
    key: cfg.googleApiToken,
    searchType: "image"
  };

  try {
    const response = await axios.get(baseApi, { params });

    if (!response.data.items || response.data.items.length === 0) {
      bot.sendMessage("No photo found.");
    } else {
      const item = utils.randomChoice(response.data.items);
      bot.sendPhoto(chatId, item.link);
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      bot.sendMessage(chatId, error.response.status);
    }
    console.error(error.response);
  }
};
