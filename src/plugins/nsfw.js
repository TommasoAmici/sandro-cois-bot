module.exports = bot => (msg, _) => {
  const chatId = msg.chat.id;
  const nsfw =
    "NSFW\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nNSFW";
  bot.sendMessage(chatId, nsfw);
};
