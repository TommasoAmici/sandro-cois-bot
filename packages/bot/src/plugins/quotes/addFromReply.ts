import TelegramBot from "node-telegram-bot-api";
import { addQuote } from "./add";

export default (bot: TelegramBot, addDate = false) =>
  (msg: TelegramBot.Message): void => {
    const msgReply = msg.reply_to_message;
    if (msgReply.text && msgReply.text.length !== 0) {
      const quote = msgReply;

      const author =
        msgReply.forward_from === undefined
          ? msgReply.from.first_name
          : msgReply.forward_from.first_name;

      let date: string;
      if (addDate) {
        date = new Date(msgReply.date * 1000).toLocaleDateString("it-IT");
      } else {
        date = null;
      }

      addQuote(quote.text, author, date, msg.chat.id, bot);
    }
  };
