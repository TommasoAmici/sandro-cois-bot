module.exports = (bot, db) => msg => {
  const message = db.random();
  bot.sendMessage(msg.chat.id, message);
};
