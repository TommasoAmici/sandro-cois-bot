import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

const getFileId = (msg: TelegramBot.Message): string => {
  if (msg.document) return msg.document.file_id;
  return msg.sticker.file_id;
};

export default (
  bot: TelegramBot,
  db: Cetriolino,
  regex: RegExp,
  messageOnSuccess: string
) => (msg: TelegramBot.Message): void => {
  const key = msg.reply_to_message.text.match(regex)[1];
  const fileId = getFileId(msg);
  db.set(key, fileId);
  bot.sendMessage(msg.chat.id, messageOnSuccess);
};
