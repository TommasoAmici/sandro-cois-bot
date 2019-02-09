import * as TelegramBot from 'node-telegram-bot-api';
import getImage from './getImage';

export default (bot: TelegramBot) =>
    (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
      let query: string;
      if (msg.reply_to_message) {
        query = msg.reply_to_message.text;
      } else {
        query = match[1];
      }
      getImage(query, bot, msg);
    };
