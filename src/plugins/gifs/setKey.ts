import { Message } from "node-telegram-bot-api";

export default bot => (msg: Message, match: RegExpMatchArray) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Reply to this message with the gif for ${match[1]}.gif`
  );
};
