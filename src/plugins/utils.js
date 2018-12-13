const axios = require("axios");
const cfg = require("../config");

const randomChoice = choices =>
  choices[Math.floor(Math.random() * choices.length)];

// random number between min and max inclusive
const randInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const toTitleCase = str =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

const getGif = async query => {
  const baseApi = "https://api.giphy.com/v1/gifs/search";

  const params = {
    q: query,
    limit: 20,
    api_key: cfg.giphyToken,
    rating: "R",
    lang: "it"
  };
  return await axios.get(baseApi, { params });
};

const sendGif = (bot, msg, response) => {
  if (!response.data.data || response.data.data.length === 0) {
    bot.sendMessage("No gif found.");
  } else {
    const item = randomChoice(response.data.data);
    bot.sendVideo(msg.chat.id, item.images.original.mp4);
  }
};

module.exports = {
  randomChoice,
  shuffle,
  randInt,
  toTitleCase,
  sendGif,
  getGif
};
