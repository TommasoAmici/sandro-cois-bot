module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;

  if (msg.reply_to_message.text && msg.reply_to_message.text.length !== 0) {
    const quote = `${msg.reply_to_message.text}\n– ${
      msg.reply_to_message.from.first_name
    }`;
    db.set(msg.message_id, quote);
  }

  bot.sendMessage(chatId, "Quote added!");
};
