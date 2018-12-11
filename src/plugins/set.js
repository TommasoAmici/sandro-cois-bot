module.exports = (bot, db) => (msg, match) => {
  const key = match[1];
  const val = match[2];

  const message = `${key} => ${val}`;

  db.set(key, val);

  bot.sendMessage(msg.chat.id, message);
};
