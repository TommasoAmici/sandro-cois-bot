const fs = require("fs");

module.exports = (bot, m) => (msg, match) => {
  const chatId = msg.chat.id;

  const stream = fs.createReadStream("./markov.txt");

  m.seed(stream, () => {
    const respondTo = match[1] ? match[1] : "";
    const res = m.respond(respondTo).join(" ");
    bot.sendMessage(chatId, res);
  });
};
