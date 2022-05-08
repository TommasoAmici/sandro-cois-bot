import TelegramBot from "node-telegram-bot-api";
import cfg from "./config";
import plugins from "./plugins";
import {
  countBestemmia,
  printBestemmiatori,
  printUserBestemmie,
} from "./plugins/bestemmie";
import ultimouomo from "./plugins/ultimouomo";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.telegramToken, { polling: true });

bot.onText(/^[/!]gif(?:@\w+)? (.+)/i, plugins.giphy(bot));
bot.onText(/^[/!]magic8ball(?:@\w+)?/i, plugins.magic8ball(bot));
bot.onText(
  /^[/!]attivatelegrampremium(?:@\w+)?/i,
  plugins.telegramPremium(bot),
);
bot.onText(/^[/!]weather(?:@\w+)? (\w+)/i, plugins.weather(bot));
bot.onText(/^[/!]loc(?:@\w+)? (\w+)/i, plugins.loc(bot));
bot.onText(/^[/!]treccani(?:@\w+)? (\w+)/i, plugins.treccani(bot));
bot.onText(/^[/!]kedde(?:@\w+)? ([\s\S]*)/i, plugins.kedde(bot));
bot.onText(/^[/!]calc(?:@\w+)? (.+)/i, plugins.calc(bot));
bot.onText(/^(what|cosa|cos|wat)$/i, plugins.what(bot));
bot.onText(/^[/!]pokedex(?:@\w+)? ([a-zA-Z]+)/i, plugins.pokedex.byName(bot));
bot.onText(/^[/!]pokedex(?:@\w+)? (\d+)/i, plugins.pokedex.byId(bot));
// COVID
bot.onText(/^[/!](\d+)covid/i, plugins.coronavirus.gago(bot));
bot.onText(/^[/!]covid(\d+)/i, plugins.coronavirus.gago(bot));
bot.onText(/^[/!]covid$/i, plugins.coronavirus.percent(bot));
bot.onText(
  /^[/!]covid(?:@\w+)? ([a-zA-Z -]+)/i,
  plugins.coronavirus.country(bot),
);
// AMORE-MERDA
bot.onText(/^(.+)\s*amore$/gi, plugins.amoreMerda.amore());
bot.onText(/^[/!]amore$/gi, plugins.amoreMerda.summaryAmore(bot));
bot.onText(/^(.+)\s*merda$/gi, plugins.amoreMerda.merda());
bot.onText(/^[/!]merda$/gi, plugins.amoreMerda.summaryMerda(bot));

// GAGO
bot.onText(/^[/!](\d+)gago/i, plugins.gago.numeric(bot));
bot.onText(/^[/!](gago)+/i, plugins.gago.alpha(bot));
bot.onText(/^[/!](evilgago){2,}/i, plugins.gago.evil(bot));
bot.onText(/^[/!]nsfw(?:@\w+)?/i, plugins.nsfw(bot));

// [A-Za-z\u00C0-\u017F\0-9\]
// regex for accented chars https://stackoverflow.com/a/11550799

export const media = {
  stickers: { type: "stickers", ext: "stk" },
  gifs: { type: "gifs", ext: "gif" },
  photos: { type: "photos", ext: "png" },
  text: { type: "text", ext: "txt" },
};

// STICKERS
bot.onText(/^[/!]stklist(?:@\w+)?$/i, plugins.list(bot, media.stickers));
bot.onText(
  /^[/!]setstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  plugins.setKey(bot, media.stickers),
);
bot.onText(
  /^[/!]unsetstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  plugins.unset(bot, media.stickers),
);
bot.onText(/^(?!.*http)(.+)\.stk$/i, plugins.get(bot, media.stickers));
bot.on(
  "sticker",
  plugins.setValue(
    bot,
    /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(stk)/i,
    media.stickers,
  ),
);

// IMAGES
bot.onText(/^[/!][iì](?:@\w+)? (.+)/i, plugins.getImage(bot));
bot.onText(/^[/!][iì](?:@\w+)?$/i, plugins.getImage(bot));
bot.onText(
  /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)$/i,
  plugins.get(bot, media.photos),
);
bot.onText(
  /^[/!]setpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  plugins.setKey(bot, media.photos),
);
bot.onText(/^[/!]piclist(?:@\w+)?$/i, plugins.list(bot, media.photos));
bot.onText(
  /^[/!]unsetpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  plugins.unset(bot, media.photos),
);
bot.on(
  "photo",
  plugins.setValue(
    bot,
    /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)/i,
    media.photos,
  ),
);

// GIFS
bot.onText(
  /^[/!]setgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  plugins.setKey(bot, media.gifs),
);
bot.onText(/^[/!]giflist(?:@\w+)?$/i, plugins.list(bot, media.gifs));
bot.onText(
  /^[/!]unsetgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  plugins.unset(bot, media.gifs),
);
bot.onText(
  /^(?!.*http)(.+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)$/i,
  plugins.get(bot, media.gifs),
);

bot.on(
  "document",
  plugins.setValue(
    bot,
    /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
    media.gifs,
  ),
);
bot.on(
  "video",
  plugins.setValue(
    bot,
    /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
    media.gifs,
  ),
);

// TEXT
bot.onText(/^[/!]setlist(?:@\w+)?$/i, plugins.list(bot, media.text));
bot.onText(
  /^[/!]set(?:@\w+)? (.*?) (.+)/i,
  plugins.text.setValue(bot, media.text),
);
bot.onText(/^[/!]unset(?:@\w+)? (.+)/i, plugins.unset(bot, media.text));
bot.onText(/^\S+/i, plugins.text.get(bot, media.text));

// QUOTES
bot.onText(/^[/!]addquote(?:@\w+)? ?([\s\S]*)/i, plugins.quotes.add(bot));
bot.onText(/^[/!]addquote(?:@\w+)?$/i, plugins.quotes.addFromReply(bot));
bot.onText(
  /^[/!]addquotedate(?:@\w+)?$/i,
  plugins.quotes.addFromReply(bot, true),
);
bot.onText(/^[/!]unquote(?:@\w+)?$/i, plugins.quotes.remove(bot));
bot.onText(/^[/!]quote(?:@\w+)? (.+)/i, plugins.quotes.get(bot));
bot.onText(/^[/!]quote(?:@\w+)?$/i, plugins.quotes.random(bot));

// bestemmie
bot.onText(
  /((porc(o|a)d?)|(mannaggia( al? )?)|\b)(dio|gesù|cristo|madonna|padre pio|san(ta|to|ti|t')? \w+)( \w+)?/i,
  countBestemmia,
);
bot.onText(/^[/!]le_mie_bestemmie$/i, printUserBestemmie(bot));
bot.onText(/^[/!]bestemmiatori$/i, printBestemmiatori(bot));

bot.onText(
  /^[/!](campionati|tornei|competitions)$/i,
  plugins.footballData.competitions(bot),
);
bot.onText(/^[/!]ieri ?(\w+)?$$/i, plugins.footballData.matches(bot, -1));
bot.onText(/^[/!]oggi ?(\w+)?$$/i, plugins.footballData.matches(bot, 0));
bot.onText(/^[/!]domani ?(\w+)?$/i, plugins.footballData.matches(bot, 1));
bot.onText(
  /^[/!]ieri_arbitri ?(\w+)?$$/i,
  plugins.footballData.matches(bot, -1, true),
);
bot.onText(
  /^[/!]oggi_arbitri ?(\w+)?$$/i,
  plugins.footballData.matches(bot, 0, true),
);
bot.onText(
  /^[/!]domani_arbitri ?(\w+)?$/i,
  plugins.footballData.matches(bot, 1, true),
);
bot.onText(/^[/!]classifica ?(\w+)?$/i, plugins.footballData.standings(bot));
bot.onText(/^[/!]spongebob(?:@\w+)? (.+)/i, plugins.spongebob(bot));
bot.onText(/^[/!]spongebob(?:@\w+)?$/i, plugins.spongebobInReply(bot));
bot.onText(/^[/!]roll(?:@\w+)? (\d+)d(\d+)$/i, plugins.roll(bot));
bot.onText(/^[/!]roll(?:@\w+)? d(\d+)$/i, plugins.roll(bot));
bot.onText(
  /^\/r\/(\w+)(?:@\w+)? (hot|new|controversial|gilded|top|rising)/i,
  plugins.reddit(bot),
);
bot.onText(/^\/r\/(\w+)(?:@\w+)?$/i, plugins.reddit(bot));
bot.onText(/^[/!]stats(?:@\w+)?$/i, plugins.stats.print(bot));
bot.on("message", plugins.stats.count());

// google translate
bot.onText(/^[/!]gaelico(?:@\w+)? ([\s\S]*)/i, plugins.gtranslate(bot, "ga"));
bot.onText(/^[/!]tedesco(?:@\w+)? ([\s\S]*)/i, plugins.gtranslate(bot, "de"));
bot.onText(/^[/!]francese(?:@\w+)? ([\s\S]*)/i, plugins.gtranslate(bot, "fr"));
bot.onText(/^[/!]olandese(?:@\w+)? ([\s\S]*)/i, plugins.gtranslate(bot, "nl"));
bot.onText(/^[/!]inglese(?:@\w+)? ([\s\S]*)/i, plugins.gtranslate(bot, "en"));
bot.onText(/^[/!]spagnolo(?:@\w+)? ([\s\S]*)/i, plugins.gtranslate(bot, "es"));
bot.onText(
  /^[/!]napoletano(?:@\w+)? ([\s\S]*)/i,
  plugins.gtranslate(bot, "sw"),
);

bot.onText(/^[/!]settitle(?:@\w+)? ([\s\S]*)/i, plugins.setTitle(bot));
bot.onText(/^[/!]nazi(?:@\w+)?$/i, plugins.naziMods(bot));
bot.onText(/^[/!](calciomercato|cm)(?:@\w+)?$/i, plugins.calciomercato(bot));

bot.onText(
  /^[/!](stonks|stocks|borsa)(?:@\w+)? (\w*\.\w*)$/i,
  plugins.stocks.quote(bot),
);
bot.onText(
  /^[/!](stonkssearch|stockssearch|borsacerca)(?:@\w+)? (\w+)$/i,
  plugins.stocks.search(bot),
);

// Football trivia game
bot.onText(/^[/!]buildgame(?:@\w+)?$/i, plugins.footballGame.build(bot));
bot.onText(/^[/!]trivia(?:@\w+)?$/i, plugins.footballGame.play(bot));
bot.onText(/^[/!]surrender(?:@\w+)?$/i, plugins.footballGame.solution(bot));
bot.onText(/^[/!]ranking(?:@\w+)?$/i, plugins.footballGame.ranking(bot));
bot.onText(
  /^[/!]solution(?:@\w+)? ([\s\S]*)/i,
  plugins.footballGame.winner(bot),
);

bot.onText(/^[/!]echoid(?:@\w+)?$/i, plugins.echoID(bot));
// osterie
bot.onText(/^[/!]osterie$/i, plugins.osteria.list(bot));
bot.onText(/^[/!]osteria$/i, plugins.osteria.random(bot));
bot.onText(/^[/!]osteria ([\s\S]+){1}/i, plugins.osteria.detail(bot));

bot.onText(/ultimouomo\.com/gi, ultimouomo(bot));
