import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Reply to this message with the sticker for ${match[1]}.stk`
  );
};
