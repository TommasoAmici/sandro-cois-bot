const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const telegramToken = "";

// Create a bot that uses 'polling' to fetch new updates
export const bot = new TelegramBot(telegramToken, { polling: true });
