import TelegramBot from "node-telegram-bot-api";
import magic8ball from "./plugins/magic8Ball";
import { randomChoice } from "./plugins/utils";

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

  const resp = match[1]; // the captured "whatever"

  const query = encodeURIComponent(resp);

  const googleApiToken = "";
  // from https://cse.google.com/
  const googleCseToken = "";
  const baseApi = "https://www.googleapis.com/customsearch/v1";

  unirest
    .get(
      `${baseApi}?q=${query}&cx=${googleCseToken}&key=${googleApiToken}&searchType=image`
    )
    .end(function(result) {
      bot.sendPhoto(chatId, randomChoice(result.body.items).link);
    });
});

// Matches "!i [whatever]"
bot.onText(/\/magic8ball/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, magic8ball());
});
