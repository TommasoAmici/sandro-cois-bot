import * as TelegramBot from 'node-telegram-bot-api';
import utils from './utils';

const choices = [
    '😷',
    '🤒',
    '🤧',
    '😰',
    '👨‍🔬',
    '👩‍🔬',
    '🙏',
    '💦',
    '🚑',
    '🏥',
    '💉',
    '💊',
    '🌡',
    '🔬',
    '🆘',
    '☣',
    '️🇮🇹',
    '🇨🇳',
    '🇮🇷',
    '👑',
    '🦠',
];

const gago = (k: number): string => {
    let elements = [];
    for (let i = 0; i < k; i++) {
        elements.push(utils.randomChoice(choices));
    }
    return elements.join('');
};

export default (bot: TelegramBot) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): void => {
    const gagoIndex = +match[1] <= 1500 ? +match[1] : 1500;
    const message = gago(gagoIndex);
    bot.sendMessage(msg.chat.id, message);
};
