import * as TelegramBot from 'node-telegram-bot-api';
import Cetriolino from 'cetriolino';
import { GifCount } from './count';

const medals = ['🥇', '🥈', '🥉'];

export default (bot: TelegramBot, db: Cetriolino) => (
    msg: TelegramBot.Message
): void => {
    const currDate = new Date();
    const keys = db.keys();
    const objs = keys.map(k => {
        const gif: GifCount = db.get(k);
        return { id: k, count: gif.count, date: new Date(gif.date) };
    });
    const pastWeeksGifs = objs
        .filter(d => currDate.valueOf() - d.date.valueOf() <= 604800000)
        .sort((a, b) => b.count - a.count);
    bot.sendMessage(msg.chat.id, 'GIFS OF THE WEEK');
    for (let i = 0; i < 3; i++) {
        bot.sendDocument(msg.chat.id, pastWeeksGifs[i].id, {
            caption: `${medals[i]} ${pastWeeksGifs[i].count}`,
        });
    }
};
