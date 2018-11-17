const utils = require("./utils");

module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const message = db.get(match[0]);

  bot.sendMessage(chatId, message);
};
