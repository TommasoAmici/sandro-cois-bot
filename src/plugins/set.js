const utils = require("./utils");

module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const keyValue = utils.splitKeyValues(match[1]);

  const message = `${keyValue.key} => ${keyValue.value}`;

  db.set(keyValue.key, keyValue.value);

  bot.sendMessage(chatId, message);
};
