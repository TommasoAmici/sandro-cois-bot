const utils = require("./utils");

const choices = [
  "😍",
  "🍆 💦 😫",
  "👌😂",
  "💯 ",
  "🔝🔝",
  "🔝 ",
  "💯🔝💯",
  " ",
  "😂😂😂",
  " gago "
];

const gago = () => {
  let elements = [];
  for (let i = 0; i < 15; i++) {
    elements.push(utils.randomChoice(choices));
  }
  return elements.join("");
};

module.exports = bot => (msg, _) => {
  const chatId = msg.chat.id;
  const message = gago();
  bot.sendMessage(chatId, message);
};
