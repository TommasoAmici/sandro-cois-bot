import { Bot } from "grammy";

import { middlewareFactory } from "@/middleware";
import gago from "@/plugins/9gago";
import { amoreMerdaComposer } from "@/plugins/amoreMerda";
import { anyGood } from "@/plugins/anyGood";
import { bestemmieComposer } from "@/plugins/bestemmie";
import { calculator } from "@/plugins/calc";
import calciomercato from "@/plugins/calciomercato";
import { randomChant } from "@/plugins/chants";
import { coronavirusGago, coronavirusPercent } from "@/plugins/coronavirus";
import { cursive, cursiveInReply } from "@/plugins/cursive";
import { echoID } from "@/plugins/echoID";
import { footballDataComposer } from "@/plugins/footballData";
import getImage from "@/plugins/getImage";
import { giphy } from "@/plugins/giphy";
import { gtranslateComposer } from "@/plugins/gtranslate";
import { kedde, keddeInReply } from "@/plugins/kedde";
import { location } from "@/plugins/loc";
import { magic8ball } from "@/plugins/magic8Ball";
import { naziMods } from "@/plugins/naziMods";
import { nsfw } from "@/plugins/nsfw";
import { osteriaDetail, osteriaList, osteriaRandom } from "@/plugins/osteria";
import { pokedexByID, pokedexByName } from "@/plugins/pokedex";
import { quoteComposer } from "@/plugins/quotes";
import { reddit } from "@/plugins/reddit";
import { roll } from "@/plugins/roll";
import { setsComposer } from "@/plugins/set/composer";
import { setTitle } from "@/plugins/setTitle";
import { spongebob, spongebobInReply } from "@/plugins/spongebob";
import { statsComposer } from "@/plugins/stats";
import stocks from "@/plugins/stocks";
import { telegramPremium } from "@/plugins/telegramPremium";
import { treccani } from "@/plugins/treccani";
import { ultimouomo } from "@/plugins/ultimouomo";
import { weather } from "@/plugins/weather";
import { what } from "@/plugins/what";

export function initBot(bot: Bot) {
  bot.use(statsComposer);
  bot.use(setsComposer);
  bot.use(quoteComposer);
  bot.use(bestemmieComposer);
  bot.use(footballDataComposer);
  bot.use(gtranslateComposer);
  bot.use(amoreMerdaComposer);

  // COMMANDS

  // IMAGES
  bot.hears(/^[/!][iì](?:@\w+)? (.+)/i, middlewareFactory(getImage));
  bot.hears(/^[/!][iì](?:@\w+)?$/i, middlewareFactory(getImage));

  bot.hears(/^[/!]gif(?:@\w+)? (.+)/i, middlewareFactory(giphy));
  bot.hears(/^[/!]magic8ball(?:@\w+)?/i, middlewareFactory(magic8ball));
  bot.hears(
    /^[/!]attivatelegrampremium(?:@\w+)?/i,
    middlewareFactory(telegramPremium),
  );
  bot.hears(/^[/!]weather(?:@\w+)? (.+)/i, middlewareFactory(weather));
  bot.hears(/^[/!]loc(?:@\w+)? (\w+)/i, middlewareFactory(location));
  bot.hears(/^[/!]treccani(?:@\w+)? (\w+)/i, middlewareFactory(treccani));

  bot.hears(/^[/!]kedde$/i, middlewareFactory(keddeInReply));
  bot.hears(/^[/!]kedde(?:@\w+)? ([\s\S]*)/i, middlewareFactory(kedde));

  bot.hears(/^[/!]corsivo$/i, middlewareFactory(cursiveInReply));
  bot.hears(/^[/!]corsivo(?:@\w+)? ([\s\S]*)/i, middlewareFactory(cursive));

  bot.hears(/^[/!]calc(?:@\w+)? (.+)/i, middlewareFactory(calculator));
  bot.hears(/^(what|cosa|cos|wat)$/i, middlewareFactory(what));

  bot.hears(
    /^[/!]pokedex(?:@\w+)? ([a-zA-Z]+)/i,
    middlewareFactory(pokedexByName),
  );
  bot.hears(/^[/!]pokedex(?:@\w+)? (\d+)/i, middlewareFactory(pokedexByID));

  bot.hears(/^[/!](\d+)covid/i, middlewareFactory(coronavirusGago));
  bot.hears(/^[/!]covid(\d+)/i, middlewareFactory(coronavirusGago));
  bot.hears(/^[/!]covid$/i, middlewareFactory(coronavirusPercent));

  bot.hears(/^[/!]osterie$/i, middlewareFactory(osteriaList));
  bot.hears(/^[/!]osteria$/i, middlewareFactory(osteriaRandom));
  bot.hears(/^[/!]osteria ([\s\S]+){1}/i, middlewareFactory(osteriaDetail));

  bot.hears(/ultimouomo\.com/gi, middlewareFactory(ultimouomo));
  bot.hears(/^(è )?(bono|buono)\?$/gi, middlewareFactory(anyGood));

  bot.hears(/^[/!]coro(?:@\w+)? ?(\w+)?/i, middlewareFactory(randomChant));
  bot.hears(/^[/!]echoid(?:@\w+)?$/i, middlewareFactory(echoID));

  bot.hears(/^[/!]settitle(?:@\w+)? ([\s\S]*)/i, middlewareFactory(setTitle));

  bot.hears(
    /^[/!](stonks|stocks|borsa)(?:@\w+)? (\w*\.\w*)$/i,
    middlewareFactory(stocks.quote),
  );
  bot.hears(
    /^[/!](stonkssearch|stockssearch|borsacerca)(?:@\w+)? (\w+)$/i,
    middlewareFactory(stocks.search),
  );

  bot.hears(
    /^[/!](calciomercato|cm)(?:@\w+)?$/i,
    middlewareFactory(calciomercato),
  );
  bot.hears(/^[/!]nazi(?:@\w+)?$/i, middlewareFactory(naziMods));

  bot.hears(/^[/!]spongebob(?:@\w+)? (.+)/i, middlewareFactory(spongebob));
  bot.hears(/^[/!]spongebob(?:@\w+)?$/i, middlewareFactory(spongebobInReply));

  bot.hears(/^[/!]roll(?:@\w+)? (\d+)d(\d+)$/i, middlewareFactory(roll));
  bot.hears(/^[/!]roll(?:@\w+)? d(\d+)$/i, middlewareFactory(roll));

  bot.hears(
    /^\/r\/(\w+)(?:@\w+)? (hot|new|controversial|gilded|top|rising)/i,
    middlewareFactory(reddit),
  );
  bot.hears(/^\/r\/(\w+)(?:@\w+)?$/i, middlewareFactory(reddit));

  bot.hears(/^[/!](\d+)gago/i, middlewareFactory(gago.numeric));
  bot.hears(/^[/!](gago)+/i, middlewareFactory(gago.alpha));
  bot.hears(/^[/!](evilgago){2,}/i, middlewareFactory(gago.evil));
  bot.hears(/^[/!]nsfw(?:@\w+)?/i, middlewareFactory(nsfw));
}