import Cetriolino from 'cetriolino';
import * as TelegramBot from 'node-telegram-bot-api';
import { getImage } from './getImage';

export default (bot: TelegramBot, db: Cetriolino) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    const query = match[1].toLowerCase();
    const imgId = db.get(query);
    if (imgId && imgId.length !== 0) {
        bot.sendPhoto(msg.chat.id, imgId);
    } else {
        // if no image is set try google api
        try {
            getImage(query, bot, msg);
        } catch (error) {
            if (error.response && error.response.status >= 400) {
                bot.sendMessage(msg.chat.id, error.response.status);
            }
            console.error(error.response);
        }
    }
};
