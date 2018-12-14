import { Message } from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (bot, db: Cetriolino) => (msg: Message) => {
  const regexGif = new RegExp(
    /([A-Za-z\u00C0-\u017F_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i
  );
  const key = msg.reply_to_message.text.match(regexGif)[1];
  db.set(key, msg.document.file_id);
  bot.sendMessage(msg.chat.id, "Gif set!");
};
