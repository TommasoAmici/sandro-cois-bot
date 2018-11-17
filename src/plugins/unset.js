const utils = require("./utils");

module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const keyValue = utils.splitKeyValues(match[1]);

  db.remove(keyValue.value);

  bot.sendMessage(chatId, `Unset ${keyValue.value}`);
};
