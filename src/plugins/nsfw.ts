import { Message } from "node-telegram-bot-api";

export default bot => (msg: Message) => {
  const nsfw =
    "NSFW\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nNSFW";
  bot.sendMessage(msg.chat.id, nsfw);
};
