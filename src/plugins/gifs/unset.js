module.exports = (bot, db) => (msg, match) => {
  const key = match[1];

  db.remove(key);

  bot.sendMessage(msg.chat.id, `Unset ${key}.gif`);
};
