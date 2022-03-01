import TelegramBot from "node-telegram-bot-api";

const spongebob = word => {
  let output = [];
  for (let char of word) {
    output.push(Math.random() > 0.5 ? char.toUpperCase() : char);
  }
  return output.join("");
};

export const spongebobInReply =
  (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    if (msg.reply_to_message) {
      const message = spongebob(msg.reply_to_message.text);
      bot.sendMessage(msg.chat.id, message);
    }
  };

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    const message = spongebob(match[1].toLowerCase());
    bot.sendMessage(msg.chat.id, message);
  };
