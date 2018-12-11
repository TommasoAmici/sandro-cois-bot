module.exports = bot => (msg, match) => {
  let output = [];
  for (char in match[1]) {
    output.push(
      Math.random() > 0.5 ? match[1][char].toUpperCase() : match[1][char]
    );
  }
  bot.sendMessage(msg.chat.id, output.join(""));
};
