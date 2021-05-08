import * as TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => async (
  msg: TelegramBot.Message
): Promise<void> => {
  const admins = await bot.getChatAdministrators(msg.chat.id);
  const nazis =
    "Taking my mods for a walk ( ͡° ͜ʖ ͡°)╯╲___卐卐卐卐\n\n" +
    admins.map((a) => a.user.username).join("\n");
  bot.sendMessage(msg.chat.id, nazis);
};
