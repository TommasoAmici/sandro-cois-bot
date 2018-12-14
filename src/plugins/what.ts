import { Message } from "node-telegram-bot-api";

export default bot => (msg: Message) => {
  if (msg.reply_to_message) {
    bot.sendMessage(msg.chat.id, msg.reply_to_message.text.toUpperCase());
  }
};
