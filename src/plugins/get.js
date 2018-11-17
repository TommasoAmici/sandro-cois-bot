module.exports = (bot, db, markovStream) => (msg, match) => {
  const chatId = msg.chat.id;

  // store every message to generate markov chains
  markovStream.write(match.input + "\n");

  const message = db.get(match[0]);

  if (message && message.length !== 0) {
    bot.sendMessage(chatId, message);
  }
};
