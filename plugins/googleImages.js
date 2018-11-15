const unirest = require("unirest");
const bot = require("../main");

// from https://console.developers.google.com/apis/credentials
const googleApiToken = "";
// from https://cse.google.com/
const googleCseToken = "";
const baseApi = "https://www.googleapis.com/customsearch/v1";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Matches "!i [whatever]"
bot.onText(/!i (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  const query = encodeURIComponent(resp);

  unirest
    .get(
      `${baseApi}?q=${query}&cx=${googleCseToken}&key=${googleApiToken}&searchType=image`
    )
    .end(function(result) {
      // search returns 10 results, get one at random
      const img = result.body.items[getRandomInt(0, 9)].link;
      if (img === null) {
        bot.sendPhoto(chatId, "Error downloading image");
      } else {
        bot.sendPhoto(chatId, img);
      }
    });
});
