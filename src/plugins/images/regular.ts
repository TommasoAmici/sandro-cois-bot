import * as TelegramBot from "node-telegram-bot-api";
import getImage from "./getImage";

export default (bot: TelegramBot) => async (
  msg: TelegramBot.Message,
  match: RegExpMatchArray
): Promise<void> => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const query = match[1];
  getImage(query, bot, msg);
};
