module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const key = match[1];

  db.remove(key);

  bot.sendMessage(chatId, `Unset ${key}`);
};
