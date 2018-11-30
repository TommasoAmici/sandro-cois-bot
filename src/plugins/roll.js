const utils = require("./utils");

module.exports = bot => (msg, match) => {
  const chatId = msg.chat.id;
  let sides = match[1];
  if (sides >= 1000) sides = 1000;

  let count = match[2];
  if (count === undefined || count == 0) count = 1;
  if (count >= 1000) count = 1000;

  let total = 0;
  let throws = [];
  for (let i = 0; i < count; i++) {
    let val = utils.randInt(1, sides);
    total += val;
    throws.push(val);
  }

  bot.sendMessage(chatId, `${throws.join(" ")} | Total: ${total}`);
};
