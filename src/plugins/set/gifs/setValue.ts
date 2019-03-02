import Cetriolino from 'cetriolino';
import * as TelegramBot from 'node-telegram-bot-api';

export const getFileId = (msg: TelegramBot.Message): string => {
    if (msg.document) return msg.document.file_id;
    return msg.sticker.file_id;
};

export default (
    bot: TelegramBot,
    db: Cetriolino,
    regex: RegExp,
    msg: TelegramBot.Message
): void => {
    let key: string;
    // function runs for every document, but it's not always applicable
    try {
        key = msg.reply_to_message.text.match(regex)[1].toLowerCase();
    } catch (e) {
        key = null;
    }
    if (key !== null) {
        const fileId = getFileId(msg);
        db.set(key, fileId);
        bot.sendMessage(msg.chat.id, 'Gif set!');
    }
};
