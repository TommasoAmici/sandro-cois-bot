module.exports = (bot, db) => msg => {
  const chatId = msg.chat.id;
  const message = db.random();
  bot.sendMessage(chatId, message);
};
