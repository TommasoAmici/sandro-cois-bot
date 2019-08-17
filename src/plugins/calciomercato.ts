import * as TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { AllHtmlEntities } from 'html-entities';

import utils from './utils';

const entities = new AllHtmlEntities();
const url =
    'https://www.calciomercato.com/api/articles.html?limit=36&favourite_team=mercato&articleType=categoryNews';

export default (bot: TelegramBot) => (msg: TelegramBot.Message) => {
    axios
        .get(url)
        .then(res => {
            const article = utils.randomChoice(
                (parse(res.data).childNodes as any[]).filter(
                    (a: any) => a.tagName === 'article'
                )
            );
            const item = article
                .querySelector('.news-item__extract')
                .removeWhitespace();
            const href = item.attributes.href;
            const text = entities.decode(item.childNodes[0].rawText);
            bot.sendMessage(msg.chat.id, `${text}\n${href}`, {
                parse_mode: 'HTML',
            });
        })
        .catch(e => bot.sendMessage(msg.chat.id, '🤷🏻‍♂️'));
};
