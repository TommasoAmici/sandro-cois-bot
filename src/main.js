const TelegramBot = require("node-telegram-bot-api");
const Cetriolino = require("cetriolino");
const cfg = require("./config");
const fs = require("fs");
const markov = require("markov");
const m = markov(1);

// plugins
const googleImages = require("./plugins/googleImages");
const magic8ball = require("./plugins/magic8Ball");
const weather = require("./plugins/weather");
const gago = require("./plugins/9gago");
const nsfw = require("./plugins/nsfw");
const set = require("./plugins/set");
const unset = require("./plugins/unset");
const get = require("./plugins/get");
const spongebob = require("./plugins/spongebob");
const quotes = require("./plugins/quotes");
const markovPlugin = require("./plugins/markov");
const stats = require("./plugins/stats");
const printStats = require("./plugins/printStats");
const giphy = require("./plugins/giphy");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.telegramToken, { polling: true });
const db = new Cetriolino("./sandrocois.db", true);
const dbQuotes = new Cetriolino("./quotes.db", true);
const dbStats = new Cetriolino("./stats.db", true);
const markovWriteStream = fs.createWriteStream("markov.txt", { flags: "a" });

bot.onText(/^!i (.+)/i, googleImages(bot, markovWriteStream));
bot.onText(
  /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|stk)$/i,
  googleImages(bot, markovWriteStream)
);
bot.onText(/^!gif (.+)/i, giphy(bot, markovWriteStream));
bot.onText(
  /^(?!.*http)(.+)\.(gif|webm|mp4|gifv)$/i,
  giphy(bot, markovWriteStream)
);
bot.onText(/^\/magic8ball/i, magic8ball(bot));
bot.onText(/^\/weather (.+)/i, weather(bot));
bot.onText(/^\/(\d+)gago/i, gago.numeric(bot));
bot.onText(/^\/(gago)+/i, gago.alpha(bot));
bot.onText(/^\/(evilgago){2,}/i, gago.evil(bot));
bot.onText(/^!nsfw/i, nsfw(bot));
bot.onText(/^!addquote ([\s\S]*)/i, quotes.add(bot, dbQuotes));
bot.onText(/^!addquote$/i, quotes.addFromReply(bot, dbQuotes));
bot.onText(/^!unquote$/i, quotes.remove(bot, dbQuotes));
bot.onText(/^!quote (.+)/i, quotes.get(bot, dbQuotes));
bot.onText(/^!quote$/i, quotes.random(bot, dbQuotes));
bot.onText(/^!set ([\s\S]*)/i, set(bot, db));
bot.onText(/^!unset (.+)/i, unset(bot, db));
bot.onText(/^\S+/i, get(bot, db, markovWriteStream));
bot.onText(/^!spongebob (.+)/i, spongebob(bot));
bot.onText(/^\/markov (.+)/i, markov(bot));
bot.onText(/^\/markov$/i, markovPlugin(bot, m));
bot.onText(/^!stats$/i, printStats(bot, dbStats));
bot.on("message", stats(bot, dbStats));
