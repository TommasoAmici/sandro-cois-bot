import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot, ext: string) => (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): void => {
  console.log("ajo");
  bot.sendMessage(
    msg.chat.id,
    `Reply to this message with the ${ext} for ${match[1]}.${ext}`
  );
};
