import * as TelegramBot from 'node-telegram-bot-api';
import * as utf8 from 'utf8';
import client from '../../redisClient';
import utils from '../utils';

const getQuote = async (key, match) => {
    const quotes = await client.smembers(key);
    const matchingQuotes = quotes.filter((q: String) =>
        q.toLowerCase().includes(match)
    );
    return utils.randomChoice(matchingQuotes);
};

export default (bot: TelegramBot) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    const key = `chat:${msg.chat.id}:quotes`;
    const toMatch = utf8.encode(match[1]);
    const quote = await getQuote(key, toMatch);
    if (quote === undefined) {
        bot.sendMessage(msg.chat.id, 'No quote found :(');
    } else {
        bot.sendMessage(msg.chat.id, quote);
    }
};
