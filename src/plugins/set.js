module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const key = match[1];
  const val = match[2];

  const message = `${key} => ${val}`;

  db.set(key, val);

  bot.sendMessage(chatId, message);
};
