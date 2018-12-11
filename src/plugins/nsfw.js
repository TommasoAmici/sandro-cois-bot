module.exports = bot => (msg, _) => {
  const nsfw =
    "NSFW\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nNSFW";
  bot.sendMessage(msg.chat.id, nsfw);
};
