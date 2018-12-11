module.exports = (bot, db) => (msg, match) => {
  const msgReply = msg.reply_to_message;
  if (msgReply.text && msgReply.text.length !== 0) {
    const author =
      msgReply.forward_from === undefined
        ? msgReply.from.first_name
        : msgReply.forward_from.first_name;
    const quote = `${msgReply.text}\n– ${author}`;
    db.set(msg.message_id, quote);
  }

  bot.sendMessage(msg.chat.id, "Quote added!");
};
