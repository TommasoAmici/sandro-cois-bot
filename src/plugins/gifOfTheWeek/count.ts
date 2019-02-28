import * as TelegramBot from 'node-telegram-bot-api';
import Cetriolino from 'cetriolino';

export interface GifCount {
    date: Date;
    count: number;
}

export default (db: Cetriolino) => (msg: TelegramBot.Message): void => {
    if (db.exists(msg.document.file_id)) {
        const gif: GifCount = db.get(msg.document.file_id);
        db.set(msg.document.file_id, { date: gif.date, count: gif.count + 1 });
    } else {
        db.set(msg.document.file_id, { date: new Date(), count: 1 });
    }
};
