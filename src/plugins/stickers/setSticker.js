module.exports = (bot, db) => msg => {
  const regexStk = new RegExp(/(.+)\.(stk)/i);
  const key = msg.reply_to_message.text.match(regexStk)[1];
  db.set(key, msg.sticker.file_id);
  bot.sendMessage(msg.chat.id, "Sticker set!");
};
