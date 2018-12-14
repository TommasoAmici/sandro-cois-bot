import utils from "./utils";

export default bot => (msg, match) => {
  let count = match[1];
  if (count === undefined || count == 0) count = 1;
  if (count >= 1000) count = 1000;

  let sides = match[2];
  if (sides >= Number.MAX_SAFE_INTEGER) sides = Number.MAX_SAFE_INTEGER;

  if (sides === undefined) {
    sides = count;
    count = 1;
  }

  let total = 0;
  let throws = [];
  for (let i = 0; i < count; i++) {
    let val = utils.randInt(1, sides);
    total += val;
    throws.push(val);
  }

  bot.sendMessage(msg.chat.id, `${throws.join(" ")} | Total: ${total}`);
};
