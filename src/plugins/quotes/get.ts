import * as TelegramBot from 'node-telegram-bot-api';
import * as utf8 from 'utf8';
import client from '../../redisClient';
import utils from '../utils';

const getQuote = async (key, match) => {
    const quotes = await client.sscan(
        key,
        0,
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
    const toMatch = utf8.encode(match[1]);
    const quotes = await getQuote(key, toMatch);
    if (quotes === undefined) {
        bot.sendMessage(msg.chat.id, 'No quote found :(');
    } else {
        const quote = utils.randomChoice(quotes);
        bot.sendMessage(msg.chat.id, quote);
    }
};
