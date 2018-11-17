const TelegramBot = require("node-telegram-bot-api");
const googleImages = require("./plugins/googleImages");
const magic8ball = require("./plugins/magic8Ball");
const weather = require("./plugins/weather");
const gago = require("./plugins/9gago");
const nsfw = require("./plugins/nsfw");
const cfg = require("./config");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.telegramToken, { polling: true });

bot.onText(/!i (.+)/, googleImages(bot));
bot.onText(/\/magic8ball/, magic8ball(bot));
bot.onText(/\/weather (.+)/, weather(bot));
bot.onText(/\/9gago/, gago(bot));
