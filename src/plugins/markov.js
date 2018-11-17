const markov = require("markov");
const fs = require("fs");
const m = markov(1);

module.exports = bot => (msg, match) => {
  const chatId = msg.chat.id;

  console.log(1);
  const stream = fs.createReadStream("./markov.txt");

  m.seed(stream, () => {
    const respondTo = match[1] ? match[1] : "";
    const res = m.respond(respondTo).join(" ");
    bot.sendMessage(chatId, res);
  });
};
