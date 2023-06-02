import { Bot } from "grammy";

import { hearsMiddlewareFactory } from "./middleware";
import gago from "./plugins/9gago";
import { amore, merda, summaryAmore, summaryMerda } from "./plugins/amoreMerda";
import { anyGood } from "./plugins/anyGood";
import {
  countBestemmia,
  printBestemmiatori,
  printUserBestemmie,
} from "./plugins/bestemmie";
import { calculator } from "./plugins/calc";
import calciomercato from "./plugins/calciomercato";
import { randomChant } from "./plugins/chants";
import { coronavirusGago, coronavirusPercent } from "./plugins/coronavirus";
import { cursive, cursiveInReply } from "./plugins/cursive";
import { echoID } from "./plugins/echoID";
import footballData from "./plugins/footballData";
import getImage from "./plugins/getImage";
import { giphy } from "./plugins/giphy";
import gtranslate from "./plugins/gtranslate";
import { kedde, keddeInReply } from "./plugins/kedde";
import { location } from "./plugins/loc";
import { magic8ball } from "./plugins/magic8Ball";
import { naziMods } from "./plugins/naziMods";
import { nsfw } from "./plugins/nsfw";
import { osteriaDetail, osteriaList, osteriaRandom } from "./plugins/osteria";
import { pokedexByID, pokedexByName } from "./plugins/pokedex";
import quotes from "./plugins/quotes";
import { reddit } from "./plugins/reddit";
import { roll } from "./plugins/roll";
import get from "./plugins/set/get";
import list from "./plugins/set/list";
import setKey from "./plugins/set/setKey";
import setValue from "./plugins/set/setValue";
import text from "./plugins/set/text";
import unset from "./plugins/set/unset";
import { setTitle } from "./plugins/setTitle";
import { spongebob, spongebobInReply } from "./plugins/spongebob";
import stats from "./plugins/stats";
import stocks from "./plugins/stocks";
import { telegramPremium } from "./plugins/telegramPremium";
import { treccani } from "./plugins/treccani";
import { ultimouomo } from "./plugins/ultimouomo";
import { weather } from "./plugins/weather";
import { what } from "./plugins/what";

export const media = {
  stickers: { type: "stickers", ext: "stk" },
  gifs: { type: "gifs", ext: "gif" },
  photos: { type: "photos", ext: "png" },
  text: { type: "text", ext: "txt" },
};

export function initBot(bot: Bot) {
  // MIDDLEWARES
  bot.on("message", stats.count);
  bot.on(
    ":photo",
    setValue(
      /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)/i,
      media.photos,
    ),
  );
  bot.on(
    ":sticker",
    setValue(/([A-Za-z\u00C0-\u017F\0-9\_]+)\.(stk)/i, media.stickers),
  );
  bot.on(
    ":document",
    setValue(
      /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
      media.gifs,
    ),
  );
  bot.on(
    ":video",
    setValue(
      /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
      media.gifs,
    ),
  );

  // COMMANDS
  bot.hears(/^[/!]stats(?:@\w+)?$/i, hearsMiddlewareFactory(stats.print));

  bot.hears(
    /^[/!]addquote(?:@\w+)? ?([\s\S]*)/i,
    hearsMiddlewareFactory(quotes.add),
  );
  bot.hears(
    /^[/!]addquote(?:@\w+)?$/i,
    hearsMiddlewareFactory(quotes.addFromReply()),
  );
  bot.hears(
    /^[/!]addquotedate(?:@\w+)?$/i,
    hearsMiddlewareFactory(quotes.addFromReply(true)),
  );
  bot.hears(/^[/!]unquote(?:@\w+)?$/i, hearsMiddlewareFactory(quotes.remove));
  bot.hears(/^[/!]quote(?:@\w+)? (.+)/i, hearsMiddlewareFactory(quotes.get));
  bot.hears(/^[/!]quote(?:@\w+)?$/i, hearsMiddlewareFactory(quotes.random));

  bot.hears(
    /^[/!]setlist(?:@\w+)?$/i,
    hearsMiddlewareFactory(list(media.text)),
  );
  bot.hears(
    /^[/!]set(?:@\w+)? (.*?) (.+)/i,
    hearsMiddlewareFactory(text.setValue(media.text)),
  );
  bot.hears(
    /^[/!]unset(?:@\w+)? (.+)/i,
    hearsMiddlewareFactory(unset(media.text)),
  );
  bot.hears(/^\S+/i, hearsMiddlewareFactory(text.get(media.text)));

  // IMAGES
  bot.hears(/^[/!][iì](?:@\w+)? (.+)/i, hearsMiddlewareFactory(getImage));
  bot.hears(/^[/!][iì](?:@\w+)?$/i, hearsMiddlewareFactory(getImage));
  bot.hears(
    /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)$/i,
    hearsMiddlewareFactory(get(media.photos)),
  );
  bot.hears(
    /^[/!]setpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
    hearsMiddlewareFactory(setKey(media.photos)),
  );
  bot.hears(
    /^[/!]piclist(?:@\w+)?$/i,
    hearsMiddlewareFactory(list(media.photos)),
  );
  bot.hears(
    /^[/!]unsetpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
    hearsMiddlewareFactory(unset(media.photos)),
  );

  // STICKERS
  bot.hears(
    /^[/!]stklist(?:@\w+)?$/i,
    hearsMiddlewareFactory(list(media.stickers)),
  );
  bot.hears(
    /^[/!]setstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
    hearsMiddlewareFactory(setKey(media.stickers)),
  );
  bot.hears(
    /^[/!]unsetstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
    hearsMiddlewareFactory(unset(media.stickers)),
  );
  bot.hears(
    /^(?!.*http)(.+)\.stk$/i,
    hearsMiddlewareFactory(get(media.stickers)),
  );

  // GIFS
  bot.hears(
    /^[/!]setgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
    hearsMiddlewareFactory(setKey(media.gifs)),
  );
  bot.hears(
    /^[/!]giflist(?:@\w+)?$/i,
    hearsMiddlewareFactory(list(media.gifs)),
  );
  bot.hears(
    /^[/!]unsetgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
    hearsMiddlewareFactory(unset(media.gifs)),
  );
  bot.hears(
    /^(?!.*http)(.+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)$/i,
    hearsMiddlewareFactory(get(media.gifs)),
  );

  bot.hears(/^[/!]gif(?:@\w+)? (.+)/i, hearsMiddlewareFactory(giphy));
  bot.hears(/^[/!]magic8ball(?:@\w+)?/i, hearsMiddlewareFactory(magic8ball));
  bot.hears(
    /^[/!]attivatelegrampremium(?:@\w+)?/i,
    hearsMiddlewareFactory(telegramPremium),
  );
  bot.hears(/^[/!]weather(?:@\w+)? (.+)/i, hearsMiddlewareFactory(weather));
  bot.hears(/^[/!]loc(?:@\w+)? (\w+)/i, hearsMiddlewareFactory(location));
  bot.hears(/^[/!]treccani(?:@\w+)? (\w+)/i, hearsMiddlewareFactory(treccani));

  bot.hears(/^[/!]kedde$/i, hearsMiddlewareFactory(keddeInReply));
  bot.hears(/^[/!]kedde(?:@\w+)? ([\s\S]*)/i, hearsMiddlewareFactory(kedde));

  bot.hears(/^[/!]corsivo$/i, hearsMiddlewareFactory(cursiveInReply));
  bot.hears(
    /^[/!]corsivo(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(cursive),
  );

  bot.hears(/^[/!]calc(?:@\w+)? (.+)/i, hearsMiddlewareFactory(calculator));
  bot.hears(/^(what|cosa|cos|wat)$/i, hearsMiddlewareFactory(what));

  bot.hears(
    /^[/!]pokedex(?:@\w+)? ([a-zA-Z]+)/i,
    hearsMiddlewareFactory(pokedexByName),
  );
  bot.hears(
    /^[/!]pokedex(?:@\w+)? (\d+)/i,
    hearsMiddlewareFactory(pokedexByID),
  );

  bot.hears(/^[/!](\d+)covid/i, hearsMiddlewareFactory(coronavirusGago));
  bot.hears(/^[/!]covid(\d+)/i, hearsMiddlewareFactory(coronavirusGago));
  bot.hears(/^[/!]covid$/i, hearsMiddlewareFactory(coronavirusPercent));

  bot.hears(/^(.+)\s*amore$/gi, hearsMiddlewareFactory(amore));
  bot.hears(/^[/!]amore$/gi, hearsMiddlewareFactory(summaryAmore));
  bot.hears(/^(.+)\s*merda$/gi, hearsMiddlewareFactory(merda));
  bot.hears(/^[/!]merda$/gi, hearsMiddlewareFactory(summaryMerda));

  bot.hears(/^[/!]osterie$/i, hearsMiddlewareFactory(osteriaList));
  bot.hears(/^[/!]osteria$/i, hearsMiddlewareFactory(osteriaRandom));
  bot.hears(
    /^[/!]osteria ([\s\S]+){1}/i,
    hearsMiddlewareFactory(osteriaDetail),
  );

  bot.hears(/ultimouomo\.com/gi, hearsMiddlewareFactory(ultimouomo));
  bot.hears(/^(è )?(bono|buono)\?$/gi, hearsMiddlewareFactory(anyGood));

  bot.hears(/^[/!]coro(?:@\w+)? ?(\w+)?/i, hearsMiddlewareFactory(randomChant));
  bot.hears(/^[/!]echoid(?:@\w+)?$/i, hearsMiddlewareFactory(echoID));

  bot.hears(
    /^[/!]settitle(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(setTitle),
  );

  bot.hears(
    /^[/!](stonks|stocks|borsa)(?:@\w+)? (\w*\.\w*)$/i,
    hearsMiddlewareFactory(stocks.quote),
  );
  bot.hears(
    /^[/!](stonkssearch|stockssearch|borsacerca)(?:@\w+)? (\w+)$/i,
    hearsMiddlewareFactory(stocks.search),
  );

  bot.hears(
    /^[/!](calciomercato|cm)(?:@\w+)?$/i,
    hearsMiddlewareFactory(calciomercato),
  );
  bot.hears(/^[/!]nazi(?:@\w+)?$/i, hearsMiddlewareFactory(naziMods));

  bot.hears(
    /^[/!]gaelico(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(gtranslate("ga")),
  );
  bot.hears(
    /^[/!]tedesco(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(gtranslate("de")),
  );
  bot.hears(
    /^[/!]francese(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(gtranslate("fr")),
  );
  bot.hears(
    /^[/!]olandese(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(gtranslate("nl")),
  );
  bot.hears(
    /^[/!]inglese(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(gtranslate("en")),
  );
  bot.hears(
    /^[/!]spagnolo(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(gtranslate("es")),
  );
  bot.hears(
    /^[/!]napoletano(?:@\w+)? ([\s\S]*)/i,
    hearsMiddlewareFactory(gtranslate("sw")),
  );

  bot.hears(
    /((porc(o|a)d?)|(mannaggia( al? )?)|\b)(dio|gesù|cristo|madonna|padre pio|san(ta|to|ti|t')? \w+)( \w+)?/i,
    hearsMiddlewareFactory(countBestemmia),
  );
  bot.hears(
    /^[/!]le_mie_bestemmie$/i,
    hearsMiddlewareFactory(printUserBestemmie),
  );
  bot.hears(/^[/!]bestemmiatori$/i, hearsMiddlewareFactory(printBestemmiatori));

  bot.hears(
    /^[/!](campionati|tornei|competitions)$/i,
    hearsMiddlewareFactory(footballData.competitions),
  );
  bot.hears(
    /^[/!]ieri ?([a-zA-Z]+)?$/i,
    hearsMiddlewareFactory(footballData.matches(-1)),
  );
  bot.hears(
    /^[/!]oggi ?([a-zA-Z]+)?$/i,
    hearsMiddlewareFactory(footballData.matches(0)),
  );
  bot.hears(
    /^[/!]domani ?([a-zA-Z]+)?$/i,
    hearsMiddlewareFactory(footballData.matches(1)),
  );
  bot.hears(
    /^[/!]ieri_arbitri ?([a-zA-Z])?$/i,
    hearsMiddlewareFactory(footballData.matches(-1, true)),
  );
  bot.hears(
    /^[/!]oggi_arbitri ?([a-zA-Z])?$/i,
    hearsMiddlewareFactory(footballData.matches(0, true)),
  );
  bot.hears(
    /^[/!]domani_arbitri ?([a-zA-Z])?$/i,
    hearsMiddlewareFactory(footballData.matches(1, true)),
  );
  bot.hears(
    /^[/!]classifica ?(\w+)?$/i,
    hearsMiddlewareFactory(footballData.standings),
  );

  bot.hears(/^[/!]spongebob(?:@\w+)? (.+)/i, hearsMiddlewareFactory(spongebob));
  bot.hears(
    /^[/!]spongebob(?:@\w+)?$/i,
    hearsMiddlewareFactory(spongebobInReply),
  );

  bot.hears(/^[/!]roll(?:@\w+)? (\d+)d(\d+)$/i, hearsMiddlewareFactory(roll));
  bot.hears(/^[/!]roll(?:@\w+)? d(\d+)$/i, hearsMiddlewareFactory(roll));

  bot.hears(
    /^\/r\/(\w+)(?:@\w+)? (hot|new|controversial|gilded|top|rising)/i,
    hearsMiddlewareFactory(reddit),
  );
  bot.hears(/^\/r\/(\w+)(?:@\w+)?$/i, hearsMiddlewareFactory(reddit));

  bot.hears(/^[/!](\d+)gago/i, hearsMiddlewareFactory(gago.numeric));
  bot.hears(/^[/!](gago)+/i, hearsMiddlewareFactory(gago.alpha));
  bot.hears(/^[/!](evilgago){2,}/i, hearsMiddlewareFactory(gago.evil));
  bot.hears(/^[/!]nsfw(?:@\w+)?/i, hearsMiddlewareFactory(nsfw));
}
