const utils = require("./utils");

const choices = [
  "😍",
  "🍆 💦 😫",
  "👌😂",
  "💯 ",
  "🔝 ",
  " ",
  "😂😂😂",
  " gago ",
  "🤔",
  "👏",
  "🙏",
  "🍆 💦 🍑"
];

const gago = k => {
  let elements = [];
  for (let i = 0; i < k; i++) {
    elements.push(utils.randomChoice(choices));
  }
  return elements.join("");
};

module.exports = bot => (msg, match) => {
  const chatId = msg.chat.id;
  const message = gago(+match[1]);
  bot.sendMessage(chatId, message);
};
