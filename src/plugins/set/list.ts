import * as TelegramBot from 'node-telegram-bot-api';
import Cetriolino from 'cetriolino';

export default (bot: TelegramBot, db: Cetriolino) => (
    msg: TelegramBot.Message
): void => {
    const list = db.keys().join('\n');
    bot.sendMessage(msg.chat.id, list);
};
