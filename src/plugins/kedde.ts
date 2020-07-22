import * as TelegramBot from 'node-telegram-bot-api';

const translationTable = [
    { find: RegExp('c(a|i|o)', 'gi'), replace: 'ghe' },
    { find: RegExp('a|i|o', 'gi'), replace: 'e' },
    { find: 't', replace: 'd' },
    { find: 'c', replace: 'g' },
    { find: 'p', replace: 'b' },
    { find: 'q', replace: 'g' },
];

const ghenverde = (msg: string) => {
    let convertedMessage = msg;
    translationTable.forEach(
        (t) => (convertedMessage = convertedMessage.replace(t.find, t.replace))
    );
    return `hehehe ${convertedMessage} hehehe`;
};

export default (bot: TelegramBot) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    bot.sendMessage(msg.chat.id, ghenverde(match[1]));
};
