import * as TelegramBot from 'node-telegram-bot-api';
import { sscanAsync } from '../../redisClient';
import utils from '../utils';

const getQuote = async (key, match) => {
    const quotes = await sscanAsync(
        key,
        '0',
        'match',
        `*${match}*`,
        'count',
        '1000'
    );
    return quotes[1];
};

export default (bot: TelegramBot) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    const key = `chat:${msg.chat.id}:quotes`;
    const quotes = await getQuote(key, match[1]);
    if (quotes === undefined) {
        bot.sendMessage(msg.chat.id, 'No quote found :(');
    } else {
        const quote = utils.randomChoice(quotes);
        bot.sendMessage(msg.chat.id, quote);
    }
};
