const utils = require("./utils");

const findQuote = (str, db) => {
  const keys = utils.shuffle(db.keys());
  for (k in keys) {
    let quote = db.get(keys[k]);
    if (quote.toLowerCase().includes(str)) {
      return quote;
    }
  }
  return false;
};

module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;

  const quote = findQuote(match[1], db);

  if (quote) bot.sendMessage(chatId, quote);
};
