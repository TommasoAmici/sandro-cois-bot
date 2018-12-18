import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot: TelegramBot, db: Cetriolino, addDate = false) => (
  msg: TelegramBot.Message
): void => {
  const msgReply = msg.reply_to_message;
  // if message is fwd, use the original author for quote
  if (msgReply.text && msgReply.text.length !== 0) {
    const author =
      msgReply.forward_from === undefined
        ? msgReply.from.first_name
        : msgReply.forward_from.first_name;
    const date = addDate ? new Date(msgReply.date * 1000) : null;
    const dateString = date !== null ? date.toLocaleDateString("it-IT") : "";
    const quote = `${msgReply.text}\n\n– ${author} ${dateString}`;
    db.set(String(msg.message_id), quote);
  }

  bot.sendMessage(msg.chat.id, "Quote added!");
};
