import TelegramBot from "node-telegram-bot-api";
import googleImages from "./plugins/googleImages";
import magic8ball from "./plugins/magic8Ball";

// replace the value below with the Telegram token you receive from @BotFather
const telegramToken = "";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(telegramToken, { polling: true });

// Matches "!i [whatever]"
bot.onText(/!i (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const img = googleImages(msg, match);
  bot.sendPhoto(chatId, img);
});

// Matches "!i [whatever]"
bot.onText(/\/magic8ball/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, magic8ball());
});
