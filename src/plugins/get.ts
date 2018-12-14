import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";
import { WriteStream } from "fs";

export default (
  bot: TelegramBot,
  db: Cetriolino,
  markovStream: WriteStream
) => (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
  // store every message to generate markov chains
  markovStream.write(match.input + "\n");

  const message = db.get(match[0]);

  if (message && message.length !== 0) {
    bot.sendMessage(msg.chat.id, message);
  }
};
