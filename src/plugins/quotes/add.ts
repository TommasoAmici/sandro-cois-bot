import * as TelegramBot from 'node-telegram-bot-api';
import { saddAsync } from '../../redisClient';

export const addQuote = (quote, chatId, bot) => {
    const key = `chat:${chatId}:quotes`;
    saddAsync(key, quote)
        .then(res => bot.sendMessage(chatId, 'Quote added!'))
        .catch(err => bot.sendMessage(chatId, "Couldn't add quote :("));
};

export default (bot: TelegramBot) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): void => {
    const quote = match[1];
    addQuote(quote, msg.chat.id, bot);
};
