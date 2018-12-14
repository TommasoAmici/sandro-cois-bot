import utils from "../utils";

const findQuote = (str, db) => {
  const keys = utils.shuffle(db.keys());
  for (let k in keys) {
    let quote = db.get(keys[k]);
    if (quote.toLowerCase().includes(str)) {
      return quote;
    }
  }
  return false;
};

export default (bot, db) => (msg, match) => {
  const quote = findQuote(match[1].toLowerCase(), db);

  if (quote) bot.sendMessage(msg.chat.id, quote);
};
