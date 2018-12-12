// plugins
const googleImages = require("./googleImages");
const magic8ball = require("./magic8Ball");
const weather = require("./weather");
const loc = require("./loc");
const calc = require("./calc");
const pokedex = require("./pokedex");
const gago = require("./9gago");
const nsfw = require("./nsfw");
const set = require("./set");
const unset = require("./unset");
const get = require("./get");
const spongebob = require("./spongebob");
const quotes = require("./quotes");
const stats = require("./stats");
const printStats = require("./printStats");
const giphy = require("./giphy");
const roll = require("./roll");
const redditImages = require("./redditImages");
const stickers = require("./stickers");
const what = require("./what");

module.exports = {
  googleImages: googleImages,
  magic8ball: magic8ball,
  weather: weather,
  loc: loc,
  calc: calc,
  pokedex: pokedex,
  gago: gago,
  nsfw: nsfw,
  set: set,
  unset: unset,
  get: get,
  spongebob: spongebob,
  quotes: quotes,
  stats: stats,
  printStats: printStats,
  giphy: giphy,
  roll: roll,
  redditImages: redditImages,
  stickers: stickers,
  what: what
};
