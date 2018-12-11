module.exports = (bot, db) => (msg, match) => {
  const quote = match[1];

  db.set(msg.message_id, quote);

  bot.sendMessage(msg.chat.id, "Quote added!");
};
