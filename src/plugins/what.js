module.exports = bot => (msg, match) => {
  if (msg.reply_to_message) {
    bot.sendMessage(msg.chat.id, msg.reply_to_message.text.toUpperCase());
  }
};
