import Cetriolino from 'cetriolino';
import * as TelegramBot from 'node-telegram-bot-api';

export default (bot: TelegramBot, db: Cetriolino) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): void => {
    const stickerId = db.get(match[1]);
    if (stickerId && stickerId.length !== 0) {
        bot.sendSticker(msg.chat.id, stickerId);
    }
};
