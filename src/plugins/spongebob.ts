import { Message } from "node-telegram-bot-api";

export default bot => (msg: Message, match: RegExpMatchArray) => {
  let output = [];
  for (let char of match[1]) {
    output.push(
      Math.random() > 0.5 ? match[1][char].toUpperCase() : match[1][char]
    );
  }
  bot.sendMessage(msg.chat.id, output.join(""));
};
