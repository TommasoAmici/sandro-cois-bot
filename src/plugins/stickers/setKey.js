module.exports = bot => (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Reply to this message with the sticker for ${match[1]}.stk`
  );
};
