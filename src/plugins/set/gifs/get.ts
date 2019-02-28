import Cetriolino from 'cetriolino';
import * as TelegramBot from 'node-telegram-bot-api';

import utils from '../../utils';
import { GifCount } from '../../gifOfTheWeek/count';

export default (bot: TelegramBot, db: Cetriolino, dbGOTW: Cetriolino) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    const query = match[1].toLowerCase();
    const gifId = db.get(query);
    if (gifId && gifId.length !== 0) {
        bot.sendDocument(msg.chat.id, gifId);
        const gif: GifCount = dbGOTW.get(gifId);
        if (gif === undefined) {
            dbGOTW.set(gifId, { date: new Date(), count: 1 });
        } else {
            dbGOTW.set(gifId, { date: gif.date, count: gif.count + 1 });
        }
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
