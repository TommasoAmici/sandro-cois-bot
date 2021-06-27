import * as TelegramBot from "node-telegram-bot-api";
import { addQuote } from "./add";

const makeQuoteString = (msgReply, addDate) => {
  // if message is fwd, use the original author for quote
  const author =
    msgReply.forward_from === undefined
      ? msgReply.from.first_name
      : msgReply.forward_from.first_name;
  if (addDate) {
    const date = new Date(msgReply.date * 1000).toLocaleDateString("it-IT");
    return `${msgReply.text}\n\n– ${author} ${date}`;
  }
  return `${msgReply.text}\n\n– ${author}`;
};

export default (bot: TelegramBot, addDate = false) =>
  (msg: TelegramBot.Message): void => {
    const msgReply = msg.reply_to_message;
    if (msgReply.text && msgReply.text.length !== 0) {
      const quote = makeQuoteString(msgReply, addDate);
      addQuote(quote, msg.chat.id, bot);
    }
  };
