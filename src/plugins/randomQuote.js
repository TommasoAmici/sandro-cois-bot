const utils = require("./utils");

module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const message = db.random();
  bot.sendMessage(chatId, message);
};
