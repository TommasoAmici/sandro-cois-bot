module.exports = (bot, db) => (msg, match) => {
  const stickerId = db.get(match[1]);
  if (stickerId && stickerId.length !== 0) {
    bot.sendSticker(msg.chat.id, stickerId);
  }
};
