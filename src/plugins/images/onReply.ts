import * as TelegramBot from 'node-telegram-bot-api';
import getImage from './getImage';

export default (bot: TelegramBot) =>
    async(msg: TelegramBot.Message): Promise<void> => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  if (msg.reply_to_message) {
    const query = msg.reply_to_message.text;  // the captured "whatever"
    // from https://cse.google.com/
    getImage(query, bot, msg);
  }
}
