import * as TelegramBot from 'node-telegram-bot-api';
import client from '../../redisClient';

export default () => (msg: TelegramBot.Message): void => {
    const key = `${msg.chat.id}:${msg.from.id}`;
    client.hincrby(key, 'stats', 1, (err, stats) => {
        if (stats === 1) client.hset(key, 'name', msg.from.username);
    });
};
