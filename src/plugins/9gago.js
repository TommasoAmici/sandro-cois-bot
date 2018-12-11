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

module.exports = {
  numeric: bot => (msg, match) => {
    const gagoIndex = +match[1] <= 1500 ? +match[1] : 1500;
    const message = gago(gagoIndex);
    bot.sendMessage(msg.chat.id, message);
  },
  alpha: bot => (msg, match) => {
    const message = "😂".repeat((match[0].length - 1) / 4);
    bot.sendMessage(msg.chat.id, message);
  },
  evil: bot => (msg, match) => {
    const message = "😡".repeat((match[0].length - 1) / 8);
    bot.sendMessage(msg.chat.id, message);
  }
};
