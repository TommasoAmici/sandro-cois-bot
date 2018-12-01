const axios = require("axios");
const utils = require("./utils");

module.exports = bot => async (msg, match) => {
  const chatId = msg.chat.id;
  const subreddit = match[1].toLowerCase();
  let sortBy = "hot";
  if (match[2] !== undefined) sortBy = match[2].toLowerCase();

  switch (sortBy) {
    case "new":
    case "top":
    case "hot":
    case "rising":
    case "gilded":
    case "controversial":
      break;
    default:
      sortBy = "hot";
      break;
  }

  const baseApi = `https://old.reddit.com/r/${subreddit}/${sortBy}.json`;

  try {
    const response = await axios.get(baseApi);

    if (!response.data.data || response.data.data.length === 0) {
      bot.sendMessage("Nothing found.");
    } else {
      const item = utils.randomChoice(response.data.data.children);
      bot.sendPhoto(chatId, item.data.url);
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      bot.sendMessage(chatId, error.response.status);
    }
    console.error(error.response);
  }
};
