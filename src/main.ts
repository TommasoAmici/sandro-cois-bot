const Cetriolino = require('cetriolino');
import { createWriteStream } from 'fs';
import * as TelegramBot from 'node-telegram-bot-api';

import cfg from './config';
import plugins from './plugins';
import Markov from './plugins/markov';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.telegramToken, { polling: true });
const dbText = new Cetriolino('./sandrocois.db', true);
const dbQuotes = new Cetriolino('./quotes.db', true);
const dbStats = new Cetriolino('./stats.db', true);
const dbStickers = new Cetriolino('./stickers.db', true);
const dbGifs = new Cetriolino('./gifs.db', true);
const dbGOTW = new Cetriolino('./gotw.db', true);

// initialize markov chain
const markovPath = 'markov.txt';
const markovWriteStream = createWriteStream(markovPath, { flags: 'a' });
const markov = new Markov.Markov(markovPath);

bot.onText(/^[/!]i (.+)/i, plugins.images(bot));
bot.onText(/^[/!]i$/i, plugins.images(bot));
bot.onText(
    /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)$/i,
    plugins.images(bot)
);
bot.onText(/^!gif (.+)/i, plugins.gifs.giphy(bot));
bot.onText(/^[/!]magic8ball/i, plugins.magic8ball(bot));
bot.onText(/^[/!]attivatelegrampremium/i, plugins.telegramPremium(bot));
bot.onText(/^[/!]weather (\w+)/i, plugins.weather(bot));
bot.onText(/^[/!]loc (\w+)/i, plugins.loc(bot));
bot.onText(/^[/!]calc (.+)/i, plugins.calc(bot));
bot.onText(/^(what|cosa|cos|wat)$/i, plugins.what(bot));
bot.onText(/^[/!]pokedex ([a-zA-Z]+)/i, plugins.pokedex.byName(bot));
bot.onText(/^[/!]pokedex (\d+)/i, plugins.pokedex.byId(bot));

// GAGO
bot.onText(/^[/!](\d+)gago/i, plugins.gago.numeric(bot));
bot.onText(/^[/!](gago)+/i, plugins.gago.alpha(bot));
bot.onText(/^[/!](evilgago){2,}/i, plugins.gago.evil(bot));
bot.onText(/^[/!]nsfw/i, plugins.nsfw(bot));

// [A-Za-z\u00C0-\u017F]
// regex for accented chars https://stackoverflow.com/a/11550799

// STICKERS
bot.onText(/^[/!]stklist$/i, plugins.gifs.list(bot, dbStickers));
bot.onText(
    /^[/!]setsticker ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.stickers.setKey(bot, dbStickers, 'stk')
);
bot.onText(
    /^[/!]unsetstk ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.stickers.unset(bot, dbStickers, '.stk')
);
bot.onText(/^(?!.*http)(.+)\.stk$/i, plugins.stickers.get(bot, dbStickers));
const regexStk = new RegExp(/([A-Za-z\u00C0-\u017F_]+)\.(stk)/i);
bot.on(
    'sticker',
    plugins.stickers.setValue(bot, dbStickers, regexStk, 'Sticker set!')
);

// GIFS
bot.onText(
    /^[/!]setgif ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.gifs.setKey(bot, dbGifs, 'gif')
);
bot.onText(/^[/!]giflist$/i, plugins.gifs.list(bot, dbGifs));
bot.onText(
    /^[/!]unsetgif ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.gifs.unset(bot, dbGifs, '.gif')
);
bot.onText(
    /^(?!.*http)(.+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)$/i,
    plugins.gifs.get(bot, dbGifs, dbGOTW)
);

bot.on('document', plugins.gifOfTheWeek.handleGifs(bot, dbGifs, dbGOTW));
bot.onText(/^[/!]gotw$/i, plugins.gifOfTheWeek.results(bot, dbGOTW));

// TEXT
bot.onText(/^[/!]setlist$/i, plugins.text.list(bot, dbText));
bot.onText(/^[/!]set (\w+) ([\s\S]+)/i, plugins.text.setValue(bot, dbText));
bot.onText(/^[/!]unset (.+)/i, plugins.text.unset(bot, dbText, ''));
bot.onText(/^\S+/i, plugins.text.get(bot, dbText, markovWriteStream));

// QUOTES
bot.onText(/^[/!]addquote ([\s\S]*)/i, plugins.quotes.add(bot, dbQuotes));
bot.onText(/^[/!]addquote$/i, plugins.quotes.addFromReply(bot, dbQuotes));
bot.onText(
    /^[/!]addquotedate$/i,
    plugins.quotes.addFromReply(bot, dbQuotes, true)
);
bot.onText(/^[/!]unquote$/i, plugins.quotes.remove(bot, dbQuotes));
bot.onText(/^[/!]quote (.+)/i, plugins.quotes.get(bot, dbQuotes));
bot.onText(/^[/!]quote$/i, plugins.quotes.random(bot, dbQuotes));

bot.onText(/^[/!]domani$/i, plugins.footballData.matches(bot, 1));
bot.onText(/^[/!]classifica$/i, plugins.footballData.standings(bot));
bot.onText(/^[/!]spongebob (.+)/i, plugins.spongebob(bot));
bot.onText(/^[/!]markov (.+)/i, Markov.reply(bot, markov));
bot.onText(/^[/!]markov$/i, Markov.random(bot, markov));
bot.onText(/^[/!]roll (\d+)d(\d+)$/i, plugins.roll(bot));
bot.onText(/^[/!]roll d(\d+)$/i, plugins.roll(bot));
bot.onText(
    /^\/r\/(\w+) (hot|new|controversial|gilded|top|rising)/i,
    plugins.reddit(bot)
);
bot.onText(/^\/r\/(\w+)$/i, plugins.reddit(bot));
bot.onText(/^[/!]stats$/i, plugins.stats.print(bot, dbStats));
bot.on('message', plugins.stats.count(dbStats));

// google translate

bot.onText(/^[/!]gaelico ([\s\S]*)/i, plugins.gtranslate(bot, 'ga'));
bot.onText(/^[/!]tedesco ([\s\S]*)/i, plugins.gtranslate(bot, 'de'));
bot.onText(/^[/!]francese ([\s\S]*)/i, plugins.gtranslate(bot, 'fr'));
bot.onText(/^[/!]olandese ([\s\S]*)/i, plugins.gtranslate(bot, 'nl'));
bot.onText(/^[/!]inglese ([\s\S]*)/i, plugins.gtranslate(bot, 'en'));
bot.onText(/^[/!]spagnolo ([\s\S]*)/i, plugins.gtranslate(bot, 'es'));
bot.onText(/^[/!]napoletano ([\s\S]*)/i, plugins.gtranslate(bot, 'sw'));
