import * as TelegramBot from 'node-telegram-bot-api';
import { sremAsync } from '../../redisClient';

export default (bot: TelegramBot) => (msg: TelegramBot.Message): void => {
    if (msg.reply_to_message.text && msg.reply_to_message.text.length !== 0) {
        const quote = msg.reply_to_message.text;
        const key = `chat:${msg.chat.id}:quotes`;
        sremAsync(key, quote)
            .then(res => bot.sendMessage(msg.chat.id, 'Quote removed!'))
            .catch(err =>
                bot.sendMessage(msg.chat.id, "Couldn't remove quote :(")
            );
    }
};
