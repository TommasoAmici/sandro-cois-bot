export default (bot, db, markovStream) => (msg, match) => {
  // store every message to generate markov chains
  markovStream.write(match.input + '\n');

  const message = db.get(match[0]);

  if (message && message.length !== 0) {
    bot.sendMessage(msg.chat.id, message);
  }
};
