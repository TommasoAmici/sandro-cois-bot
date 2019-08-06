import * as TelegramBot from 'node-telegram-bot-api';

import cfg from './config';
import plugins from './plugins';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.telegramToken, { polling: true });

bot.onText(/^[/!]gif (.+)/i, plugins.giphy(bot));
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

export interface Media {
    type: string;
    ext: string;
}

export const media = {
    stickers: { type: 'stickers', ext: 'stk' },
    gifs: { type: 'gifs', ext: 'gif' },
    photos: { type: 'photos', ext: 'png' },
    text: { type: 'text', ext: 'txt' },
};

// STICKERS
bot.onText(/^[/!]stklist$/i, plugins.list(bot, media.stickers));
bot.onText(
    /^[/!]setstk ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.setKey(bot, media.stickers)
);
bot.onText(
    /^[/!]unsetstk ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.unset(bot, media.stickers)
);
bot.onText(/^(?!.*http)(.+)\.stk$/i, plugins.get(bot, media.stickers));
const regexStk = new RegExp(/([A-Za-z\u00C0-\u017F_]+)\.(stk)/i);
bot.on('sticker', plugins.setValue(bot, regexStk, media.stickers));

// IMAGES
bot.onText(/^[/!]i (.+)/i, plugins.getImage(bot));
bot.onText(/^[/!]i$/i, plugins.getImage(bot));
bot.onText(
    /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)$/i,
    plugins.get(bot, media.photos)
);
bot.onText(
    /^[/!]setpic ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.setKey(bot, media.photos)
);
bot.onText(/^[/!]piclist$/i, plugins.list(bot, media.photos));
bot.onText(
    /^[/!]unsetpic ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.unset(bot, media.photos)
);
const regexPic = new RegExp(
    /([A-Za-z\u00C0-\u017F_]+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)/i
);
bot.on('photo', plugins.setValue(bot, regexPic, media.photos));

// GIFS
bot.onText(
    /^[/!]setgif ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.setKey(bot, media.gifs)
);
bot.onText(/^[/!]giflist$/i, plugins.list(bot, media.gifs));
bot.onText(
    /^[/!]unsetgif ([A-Za-z\u00C0-\u017F_]+)/i,
    plugins.unset(bot, media.gifs)
);
bot.onText(
    /^(?!.*http)(.+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)$/i,
    plugins.get(bot, media.gifs)
);

const regexGif = new RegExp(
    /([A-Za-z\u00C0-\u017F_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i
);
bot.on('document', plugins.setValue(bot, regexGif, media.gifs));
bot.on('video', plugins.setValue(bot, regexGif, media.gifs));

// TEXT
bot.onText(/^[/!]setlist$/i, plugins.list(bot, media.text));
bot.onText(/^[/!]set (\w+) ([\s\S]+)/i, plugins.text.setValue(bot, media.text));
bot.onText(/^[/!]unset (.+)/i, plugins.unset(bot, media.text));
bot.onText(/^\S+/i, plugins.text.get(bot, media.text));

// QUOTES
bot.onText(/^[/!]addquote ([\s\S]*)/i, plugins.quotes.add(bot));
bot.onText(/^[/!]addquote$/i, plugins.quotes.addFromReply(bot));
bot.onText(/^[/!]addquotedate$/i, plugins.quotes.addFromReply(bot, true));
bot.onText(/^[/!]unquote$/i, plugins.quotes.remove(bot));
bot.onText(/^[/!]quote (.+)/i, plugins.quotes.get(bot));
bot.onText(/^[/!]quote$/i, plugins.quotes.random(bot));

bot.onText(/^[/!]domani$/i, plugins.footballData.matches(bot, 1));
bot.onText(/^[/!]classifica$/i, plugins.footballData.standings(bot));
bot.onText(/^[/!]spongebob (.+)/i, plugins.spongebob(bot));
bot.onText(/^[/!]spongebob$/i, plugins.spongebobInReply(bot));
bot.onText(/^[/!]roll (\d+)d(\d+)$/i, plugins.roll(bot));
bot.onText(/^[/!]roll d(\d+)$/i, plugins.roll(bot));
bot.onText(
    /^\/r\/(\w+) (hot|new|controversial|gilded|top|rising)/i,
    plugins.reddit(bot)
);
bot.onText(/^\/r\/(\w+)$/i, plugins.reddit(bot));
bot.onText(/^[/!]stats$/i, plugins.stats.print(bot));
bot.on('message', plugins.stats.count());

// google translate
bot.onText(/^[/!]gaelico ([\s\S]*)/i, plugins.gtranslate(bot, 'ga'));
bot.onText(/^[/!]tedesco ([\s\S]*)/i, plugins.gtranslate(bot, 'de'));
bot.onText(/^[/!]francese ([\s\S]*)/i, plugins.gtranslate(bot, 'fr'));
bot.onText(/^[/!]olandese ([\s\S]*)/i, plugins.gtranslate(bot, 'nl'));
bot.onText(/^[/!]inglese ([\s\S]*)/i, plugins.gtranslate(bot, 'en'));
bot.onText(/^[/!]spagnolo ([\s\S]*)/i, plugins.gtranslate(bot, 'es'));
bot.onText(/^[/!]napoletano ([\s\S]*)/i, plugins.gtranslate(bot, 'sw'));

bot.onText(/^[/!]settitle ([\s\S]*)/i, plugins.setTitle(bot));
bot.onText(/^[/!]nazi$/i, plugins.naziMods(bot));
bot.onText(/^[/!](calciomercato|cm)$/i, plugins.calciomercato(bot));
