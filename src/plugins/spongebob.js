const spongebob = input => {
  let output = [];
  for (char in input) {
    output.push(Math.random() > 0.5 ? input[char].toUpperCase() : input[char]);
  }
  return output.join("");
};

module.exports = bot => (msg, match) => {
  const chatId = msg.chat.id;
  const message = spongebob(match[1]);
  bot.sendMessage(chatId, message);
};
