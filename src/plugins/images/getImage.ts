import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';
import cfg from '../../config';
import utils from '../utils';

const baseApi = 'https://www.googleapis.com/customsearch/v1';

export default async(query: string, bot: TelegramBot, msg: TelegramBot.Message):
    Promise<void> => {
      // from https://cse.google.com/
      const params = {
        q: query,
        cx: cfg.googleCseToken,
        key: cfg.googleApiToken,
        searchType: 'image'
      };

      try {
        const response = await axios.get(baseApi, {params});

        if (!response.data.items || response.data.items.length === 0) {
          bot.sendMessage(msg.chat.id, 'No photo found.');
        } else {
          const item = utils.randomChoice(response.data.items);
          bot.sendPhoto(msg.chat.id, item.link);
        }
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          bot.sendMessage(msg.chat.id, error.response.status);
        }
        console.error(error.response);
      }
    }