import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => async (
  msg: TelegramBot.Message
): Promise<void> => {
  const kicked = await bot.kickChatMember(msg.chat.id, String(msg.from.id));
  if (kicked) {
    bot.unbanChatMember(msg.chat.id, String(msg.from.id));
    bot.sendSticker(msg.chat.id, "CAADBAADxAADuChICFX6VrCSrzkLAg");
  }
};
