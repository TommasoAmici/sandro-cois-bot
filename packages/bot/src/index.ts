import { run, sequentialize } from "@grammyjs/runner";
import { Bot } from "grammy";
import cfg from "./config";
import { gago } from "./plugins/9gago";
import { amoreMerda } from "./plugins/amoreMerda";
import { anyGood } from "./plugins/anyGood";
import { bestemmie } from "./plugins/bestemmie";
import calc from "./plugins/calc";
import { coronavirus } from "./plugins/coronavirus";
import { cursive } from "./plugins/cursive";
import { footballData } from "./plugins/footballData";
import { footballGame } from "./plugins/footballGame";
import { giphy } from "./plugins/giphy";
import { gtranslate } from "./plugins/gtranslate";
import { imageSearch } from "./plugins/imageSearch";
import { kedde } from "./plugins/kedde";
import { location } from "./plugins/location";
import { magic8ball } from "./plugins/magic8Ball";
import { naziMods } from "./plugins/naziMods";
import { nsfw } from "./plugins/nsfw";
import { osteria } from "./plugins/osteria";
import { pokemonByName } from "./plugins/pokedex";
import { quotes } from "./plugins/quotes";
import { reddit } from "./plugins/reddit";
import roll from "./plugins/roll";
import { keyValue } from "./plugins/set";
import { spongebob } from "./plugins/spongebob";
import { stats } from "./plugins/stats";
import { stocks } from "./plugins/stocks";
import { telegramPremium } from "./plugins/telegramPremium";
import { treccani } from "./plugins/treccani";
import { ultimouomo } from "./plugins/ultimouomo";
import { weather } from "./plugins/weather";
import { what } from "./plugins/what";

const bot = new Bot(cfg.telegramToken);
bot.api.setMyCommands([
  { command: "stats", description: "Shows how many messages each user sent" },
  { command: "gif", description: "Search gif on Giphy" },
  { command: "osteria", description: "Sing a random osteria" },
]);

bot.use(osteria);
bot.use(footballGame);
bot.use(gtranslate);
bot.use(stocks);
bot.use(bestemmie);
bot.use(footballData);
bot.use(gago);
bot.use(quotes);
bot.use(stats);
bot.use(amoreMerda);
bot.use(coronavirus);
bot.use(reddit);
bot.use(keyValue);
bot.use(imageSearch);

bot.hears(/^[/!]gif(?:@\w+)? (.+)/i, giphy);
bot.hears(/^[/!]magic8ball(?:@\w+)?/i, magic8ball);
bot.hears(/^[/!]attivatelegrampremium(?:@\w+)?/i, telegramPremium);
bot.hears(/^[/!]weather(?:@\w+)? (.+)/i, weather);
bot.hears(/^[/!]loc(?:@\w+)? (\w+)/i, location);
bot.hears(/^[/!]treccani(?:@\w+)? (\w+)/i, treccani);
bot.hears(/^[/!]kedde$/i, kedde);
bot.hears(/^[/!]kedde(?:@\w+)? ([\s\S]*)/i, kedde);
bot.hears(/^[/!]corsivo$/i, cursive);
bot.hears(/^[/!]corsivo(?:@\w+)? ([\s\S]*)/i, cursive);
bot.hears(/^[/!]calc(?:@\w+)? (.+)/i, calc);
bot.hears(/^(what|cosa|cos|wat)$/i, what);
bot.hears(/^[/!]pokedex(?:@\w+)? ([a-zA-Z]+)/i, pokemonByName);

bot.hears(/^[/!]nsfw(?:@\w+)?/i, nsfw);
bot.hears(/^[/!]spongebob(?:@\w+)? (.+)/i, spongebob);
bot.hears(/^[/!]roll(?:@\w+)? (\d+)d(\d+)$/i, roll);
bot.hears(/^[/!]roll(?:@\w+)? d(\d+)$/i, roll);

bot.hears(/^[/!]nazi(?:@\w+)?$/i, naziMods);

bot.hears(/^[/!]settitle(?:@\w+)? ([\s\S]*)/i, ctx =>
  ctx.setChatTitle(ctx.match[1]),
);
bot.hears(/^[/!]echoid(?:@\w+)?$/i, ctx => ctx.reply(String(ctx.chat.id)));

bot.hears(/ultimouomo\.com/gi, ultimouomo);
bot.hears(/^(è )?(bono|buono)\?$/gi, anyGood);

bot.use(
  sequentialize(ctx => {
    const chat = ctx.chat.id.toString();
    const user = ctx.from.id.toString();
    return [chat, user].filter(con => con !== undefined);
  }),
);
run(bot);
