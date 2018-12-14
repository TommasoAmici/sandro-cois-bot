import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  bot.sendMessage(
    msg.chat.id,
    `Reply to this message with the gif for ${match[1]}.gif`
  );
};
