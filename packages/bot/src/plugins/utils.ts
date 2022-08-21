import TelegramBot from "node-telegram-bot-api";

export const toTitleCase = (str: string): string =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );

export const paginateMessages = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  longMsg: string,
) => {
  const chunks: string[] = [];
  if (longMsg.length > 3000) {
    bot.sendMessage(msg.chat.id, "Dio porco ti ammazzo!");
    return;
  }
  const maxChars = longMsg.length;
  for (let i = 0; i < maxChars; i += 3000) {
    chunks.push(longMsg.substring(i, i + 3000));
  }
  chunks.forEach(chunk => {
    bot.sendMessage(msg.chat.id, chunk);
  });
};
