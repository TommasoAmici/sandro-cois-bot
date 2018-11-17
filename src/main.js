const TelegramBot = require("node-telegram-bot-api");
const cetriolino = require("./cetriolino");
const cfg = require("./config");

// plugins
const googleImages = require("./plugins/googleImages");
const magic8ball = require("./plugins/magic8Ball");
const weather = require("./plugins/weather");
const gago = require("./plugins/9gago");
const nsfw = require("./plugins/nsfw");
const set = require("./plugins/set");
const get = require("./plugins/get");
const spongebob = require("./plugins/spongebob");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.telegramToken, { polling: true });
const db = new cetriolino.Cetriolino("./sandrocois.db", true);

bot.onText(/!i (.+)/, googleImages(bot));
bot.onText(/\/magic8ball/, magic8ball(bot));
bot.onText(/\/weather (.+)/, weather(bot));
bot.onText(/\/9gago/, gago(bot));
bot.onText(/!nsfw/, nsfw(bot));
bot.onText(/!set (.+)/, set(bot, db));
bot.onText(/\w+/, get(bot, db));
bot.onText(/!spongebob (.+)/, spongebob(bot));
