module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const quote = match[1];

  db.set(msg.message_id, quote);

  bot.sendMessage(chatId, "Quote added!");
};
