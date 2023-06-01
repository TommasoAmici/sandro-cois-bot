import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    bot.banChatMember(msg.chat.id, msg.from.id);
    bot.unbanChatMember(msg.chat.id, msg.from.id);
    bot.sendSticker(msg.chat.id, "CAADBAADxAADuChICFX6VrCSrzkLAg");
  };
