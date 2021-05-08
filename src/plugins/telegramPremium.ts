import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => (msg: TelegramBot.Message): void => {
  bot.kickChatMember(msg.chat.id, String(msg.from.id));
  bot.unbanChatMember(msg.chat.id, String(msg.from.id));
  bot.sendSticker(msg.chat.id, "CAADBAADxAADuChICFX6VrCSrzkLAg");
};
