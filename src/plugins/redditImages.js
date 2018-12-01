const axios = require("axios");
const utils = require("./utils");

module.exports = bot => async (msg, match) => {
  const chatId = msg.chat.id;
  const subreddit = match[1].toLowerCase();
  let sortBy;
  if (match[2] === undefined) {
    sortBy = "hot";
  } else {
    sortBy = match[2].toLowerCase();
  }

  const baseApi = `https://old.reddit.com/r/${subreddit}/${sortBy}.json`;

  try {
    const response = await axios.get(baseApi);

    if (!response.data.data || response.data.data.length === 0) {
      bot.sendMessage("Nothing found.");
    } else {
      const item = utils.randomChoice(response.data.data.children);
      // find correct api method
      // images
      if (item.data.post_hint === "image") {
        bot.sendPhoto(chatId, item.data.url);
      }
      // hosted on reddit
      else if (item.data.post_hint === "hosted:video") {
        bot.sendVideo(chatId, item.data.media.reddit_video.fallback_url);
      }
      // external video hosting
      else if (item.data.post_hint === "rich:video") {
        // gfycat sucks
        if (item.data.domain === "gfycat.com") {
          bot.sendVideo(
            chatId,
            item.data.preview.reddit_video_preview.fallback_url
          );
        } else {
          bot.sendVideo(chatId, item.data.url);
        }
      }
      // links
      else if (item.data.post_hint === "link") {
        bot.sendMessage(
          chatId,
          `${item.data.title}\n\nhttps://old.reddit.com${
            item.data.permalink
          }\n\n${item.data.url}`
        );
      }
      // self text
      else {
        bot.sendMessage(
          chatId,
          `${item.data.title}\n\nhttps://old.reddit.com${item.data.permalink}`
        );
      }
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      bot.sendMessage(chatId, error.response.status);
    }
    console.error(error.response);
  }
};
