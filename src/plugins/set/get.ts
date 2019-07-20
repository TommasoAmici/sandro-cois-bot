import * as TelegramBot from 'node-telegram-bot-api';
import { Media, media } from '../../main';
import { hgetAsync } from '../../redisClient';
import utils from '../utils';
import { getImage } from '../getImage';

export default (bot: TelegramBot, mediaMsg: Media) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
): Promise<void> => {
    const key = match[1].toLowerCase();
    const hkey = `chat:${msg.chat.id}:${mediaMsg.type}`;
    const fileId = await hgetAsync(hkey, key);
    if (mediaMsg === media.stickers) {
        if (fileId !== null) bot.sendSticker(msg.chat.id, fileId);
    } else if (mediaMsg === media.photos) {
        if (fileId !== null) {
            bot.sendPhoto(msg.chat.id, fileId);
        } else {
            // if no image is set try google api
            try {
                getImage(key, bot, msg);
            } catch (error) {
                if (error.response && error.response.status >= 400) {
                    bot.sendMessage(msg.chat.id, error.response.status);
                }
                console.error(error.response);
            }
        }
    } else if (mediaMsg === media.gifs) {
        if (fileId !== null) {
            bot.sendDocument(msg.chat.id, fileId);
        } else {
            try {
                const response = await utils.getGif(key);
                utils.sendGif(bot, msg, response);
            } catch (error) {
                if (error.response && error.response.status >= 400) {
                    bot.sendMessage(msg.chat.id, error.response.status);
                }
                console.error(error.response);
            }
        }
    }
};
