const TelegramBot = require("node-telegram-bot-api");
const Cetriolino = require("cetriolino");
const cfg = require("./config");
const fs = require("fs");

const Markov = require("./plugins/markov");
const plugins = require("./plugins");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.telegramToken, { polling: true });
const db = new Cetriolino("./sandrocois.db", true);
const dbQuotes = new Cetriolino("./quotes.db", true);
const dbStats = new Cetriolino("./stats.db", true);
const dbStickers = new Cetriolino("./stickers.db", true);
const dbGifs = new Cetriolino("./gifs.db", true);

// initialize markov chain
const markovPath = "markov.txt";
const markovWriteStream = fs.createWriteStream(markovPath, { flags: "a" });
const markov = new Markov.Markov(markovPath);

bot.onText(/^!i (.+)/i, plugins.googleImages(bot));
bot.onText(
  /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)$/i,
  plugins.googleImages(bot)
);
bot.onText(/^!gif (.+)/i, plugins.gifs.giphy(bot));
bot.onText(/^[/!]magic8ball/i, plugins.magic8ball(bot));
bot.onText(/^[/!]weather (\w+)/i, plugins.weather(bot));
bot.onText(/^[/!]loc (\w+)/i, plugins.loc(bot));
bot.onText(/^[/!]calc (.+)/i, plugins.calc(bot));
bot.onText(/^(what|cosa|cos|wat)$/i, plugins.what(bot));
bot.onText(/^[/!]pokedex ([a-zA-Z]+)/i, plugins.pokedex.byName(bot));
bot.onText(/^[/!]pokedex (\d+)/i, plugins.pokedex.byId(bot));

// GAGO
bot.onText(/^[/!](\d+)gago/i, plugins.gago.numeric(bot));
bot.onText(/^[/!](gago)+/i, plugins.gago.alpha(bot));
bot.onText(/^[/!](evilgago){2,}/i, plugins.gago.evil(bot));
bot.onText(/^[/!]nsfw/i, plugins.nsfw(bot));

// STICKERS
bot.onText(/^[/!]setsticker (.+)/i, plugins.stickers.setKey(bot));
bot.onText(/^[/!]unsetstk (.+)/i, plugins.stickers.unset(bot, dbStickers));
bot.onText(/^(?!.*http)(.+)\.stk$/i, plugins.stickers.get(bot, dbStickers));
bot.on("sticker", plugins.stickers.setSticker(bot, dbStickers));

// GIFS
bot.onText(/^[/!]setgif (.+)/i, plugins.gifs.setKey(bot));
bot.onText(/^[/!]unsetgif (.+)/i, plugins.gifs.unset(bot, dbGifs));
bot.onText(
  /^(?!.*http)(.+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)$/i,
  plugins.gifs.get(bot, dbGifs)
);
bot.on("document", plugins.gifs.setValue(bot, dbGifs));

// QUOTES
bot.onText(/^[/!]addquote ([\s\S]*)/i, plugins.quotes.add(bot, dbQuotes));
bot.onText(/^[/!]addquote$/i, plugins.quotes.addFromReply(bot, dbQuotes));
bot.onText(/^[/!]unquote$/i, plugins.quotes.remove(bot, dbQuotes));
bot.onText(/^[/!]quote (.+)/i, plugins.quotes.get(bot, dbQuotes));
bot.onText(/^[/!]quote$/i, plugins.quotes.random(bot, dbQuotes));

bot.onText(/^[/!]set (\w+) ([\s\S]+)/i, plugins.set(bot, db));
bot.onText(/^[/!]unset (.+)/i, plugins.unset(bot, db));
bot.onText(/^\S+/i, plugins.get(bot, db, markovWriteStream));
bot.onText(/^[/!]spongebob (.+)/i, plugins.spongebob(bot));
bot.onText(/^[/!]markov (.+)/i, Markov.reply(bot, markov));
bot.onText(/^[/!]markov$/i, Markov.random(bot, markov));
bot.onText(/^[/!]stats$/i, plugins.printStats(bot, dbStats));
bot.onText(/^[/!]roll (\d+)d(\d+)$/i, plugins.roll(bot));
bot.onText(/^[/!]roll d(\d+)$/i, plugins.roll(bot));
bot.onText(
  /^\/r\/(\w+) (hot|new|controversial|gilded|top|rising)/i,
  plugins.redditImages(bot)
);
bot.onText(/^\/r\/(\w+)$/i, plugins.redditImages(bot));
bot.on("message", plugins.stats(bot, dbStats));
