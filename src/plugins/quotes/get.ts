import * as TelegramBot from 'node-telegram-bot-api';
import { sscanAsync } from '../../redisClient';
import utils from '../utils';

export default (bot: TelegramBot) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    const key = `chat:${msg.chat.id}:quotes`;
    const quotes = await sscanAsync(key, '0', 'match', `*${match[1]}*`);
    if (quotes === undefined) {
        bot.sendMessage(msg.chat.id, 'No quote found :(');
    } else {
        const quote = utils.randomChoice(quotes[1]);
        bot.sendMessage(msg.chat.id, quote);
    }
};
