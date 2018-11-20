module.exports = (bot, db) => (msg, match) => {
  const chatId = msg.chat.id;
  const msgReply = msg.reply_to_message;
  if (msgReply.text && msgReply.text.length !== 0) {
    const author =
      msgReply.forward_from.username === undefined
        ? msgReply.from.first_name
        : msgReply.forward_from.first_name;
    const quote = `${msgReply.text}\n– ${author}`;
    db.set(msg.message_id, quote);
  }

  bot.sendMessage(chatId, "Quote added!");
};
