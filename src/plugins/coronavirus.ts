import * as TelegramBot from 'node-telegram-bot-api';
import utils from './utils';

const covid = require('novelcovid');

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
    '🇪🇸',
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

const covidIndex = (): string => {
    const covidPercentage = (Math.random() * 100).toFixed(2);
    return `Hai il coronavirus con una probabilità del ${covidPercentage}%`;
};

export default {
    gago: (bot: TelegramBot) => (
        msg: TelegramBot.Message,
        match: RegExpMatchArray
    ): void => {
        const gagoIndex = +match[1] <= 1500 ? +match[1] : 1500;
        const message = gago(gagoIndex);
        bot.sendMessage(msg.chat.id, message);
    },
    percent: (bot: TelegramBot) => (msg: TelegramBot.Message): void => {
        bot.sendMessage(msg.chat.id, covidIndex());
    },
    country: (bot: TelegramBot) => (
        msg: TelegramBot.Message,
        match: RegExpMatchArray
    ) => {
        covid
            .getCountry({ country: match })
            .then(data =>
                bot.sendMessage(
                    msg.chat.id,
                    `Casi: ${data.cases}\nCasi oggi: ${data.todayCases}\n\nMorti: ${data.deaths}\nMorti oggi: ${data.todayDeaths}\n\nGuariti: ${data.recovered}`
                )
            )
            .catch(e => bot.sendMessage(msg.chat.id, String(e)));
    },
};
