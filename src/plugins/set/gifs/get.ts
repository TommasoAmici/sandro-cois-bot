import Cetriolino from 'cetriolino';
import * as TelegramBot from 'node-telegram-bot-api';

import utils from '../../utils';

export default (bot: TelegramBot, db: Cetriolino) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    const query = match[1].toLowerCase();
    const gifId = db.get(query);
    if (gifId && gifId.length !== 0) {
        bot.sendDocument(msg.chat.id, gifId);
    } else {
        // if no gif is set try giphy api
        try {
            const response = await utils.getGif(query);
            utils.sendGif(bot, msg, response);
        } catch (error) {
            if (error.response && error.response.status >= 400) {
                bot.sendMessage(msg.chat.id, error.response.status);
            }
            console.error(error.response);
        }
    }
};
