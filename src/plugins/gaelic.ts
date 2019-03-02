import * as TelegramBot from 'node-telegram-bot-api';
const translate = require('@vitalets/google-translate-api');

export default (bot: TelegramBot) => (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): void => {
    translate(match[1], {
        to: 'ga',
        from: 'it',
        agents: [
            'Mozilla/5.0 (Windows NT 10.0; ...',
            'Mozilla/4.0 (Windows NT 10.0; ...',
            'Mozilla/5.0 (Windows NT 10.0; ...',
        ],
    })
        .then(res => {
            bot.sendMessage(msg.chat.id, res.text);
        })
        .catch(err => {
            console.error(err);
        });
};
