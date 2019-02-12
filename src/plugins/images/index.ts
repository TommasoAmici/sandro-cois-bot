import * as TelegramBot from 'node-telegram-bot-api';
import getImage from './getImage';

export default (bot: TelegramBot) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): void => {
    let query = match[1];

    if (query === null && msg.reply_to_message) {
        query = msg.reply_to_message.text;
    }
    getImage(query, bot, msg);
};
