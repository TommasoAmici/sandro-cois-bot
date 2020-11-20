import axios, { AxiosResponse } from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';
import cfg from '../config';

const randomChoice = <T>(choices: T[]): T =>
    choices[Math.floor(Math.random() * choices.length)];

// random number between min and max inclusive
const randInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = (arr: any[]): any[] => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const toTitleCase = (str: string): string =>
    str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

const getGif = async (query: string): Promise<AxiosResponse> => {
    const baseApi = 'https://api.giphy.com/v1/gifs/search';

    const params = {
        q: query,
        limit: 20,
        api_key: cfg.giphyToken,
        rating: 'R',
        lang: 'it',
    };
    return await axios.get(baseApi, { params });
};

const sendGif = (
    bot: TelegramBot,
    msg: TelegramBot.Message,
    response: AxiosResponse
): void => {
    if (!response.data.data || response.data.data.length === 0) {
        bot.sendMessage(msg.chat.id, 'No gif found.');
    } else {
        const item = randomChoice(response.data.data as Gif[]);
        bot.sendVideo(msg.chat.id, item.images.original.mp4);
    }
};

const paginateMessages = (
    bot: TelegramBot,
    msg: TelegramBot.Message,
    longMsg: string
) => {
    const chunks: string[] = [];
    if (longMsg.length > 3000) {
        bot.sendMessage(msg.chat.id, 'Dio porco ti ammazzo!');
        return;
    }
    const maxChars = longMsg.length;
    for (let i = 0; i < maxChars; i += 3000) {
        chunks.push(longMsg.substring(i, i + 3000));
    }
    chunks.forEach((chunk) => {
        bot.sendMessage(msg.chat.id, chunk);
    });
};

export default {
    randomChoice,
    shuffle,
    randInt,
    toTitleCase,
    sendGif,
    getGif,
    paginateMessages,
};
