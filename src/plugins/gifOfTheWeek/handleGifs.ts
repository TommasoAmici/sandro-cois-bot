import * as TelegramBot from 'node-telegram-bot-api';
import Cetriolino from 'cetriolino';
import gifs from '../set/gifs/index';
import gifOfTheWeek from '.';

const regexGif = new RegExp(
    /([A-Za-z\u00C0-\u017F_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i
);

export default (bot: TelegramBot, dbGifs: Cetriolino, dbGOTW: Cetriolino) => (
    msg: TelegramBot.Message
): void => {
    gifOfTheWeek.count(dbGOTW, msg);
    gifs.setValue(bot, dbGifs, regexGif, msg);
};
