import * as TelegramBot from 'node-telegram-bot-api';
import { getFileId } from './setValue';
import Cetriolino from 'cetriolino';

export default (bot: TelegramBot, db: Cetriolino, ext: string) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): void => {
    if (msg.reply_to_message) {
        const fileId = getFileId(msg.reply_to_message);
        const key = match[1].toLowerCase();
        db.set(key, fileId);
        bot.sendMessage(msg.chat.id, `Set ${key}.${ext}!`);
    } else {
        bot.sendMessage(
            msg.chat.id,
            `Reply to this message with the ${ext} for ${match[1].toLowerCase()}.${ext}`
        );
    }
};
