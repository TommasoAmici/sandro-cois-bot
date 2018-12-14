import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  let output = [];
  for (let char of match[1]) {
    output.push(
      Math.random() > 0.5 ? match[1][char].toUpperCase() : match[1][char]
    );
  }
  bot.sendMessage(msg.chat.id, output.join(""));
};
