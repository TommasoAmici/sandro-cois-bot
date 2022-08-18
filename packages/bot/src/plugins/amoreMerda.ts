import { remove as removeDiacritics } from "diacritics";
import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";
import client from "../redisClient";
import { prettyPrint } from "./utils/printStandings";
import { sortRecord } from "./utils/sortRecord";

export const cleanKey = (word: string): string => {
  return word.toLowerCase().trim().replace("@", "");
};

/**
 * Records a user's expression of pleasure
 * @param ctx
 */
const amore = (ctx: HearsContext<Context>) => {
  if (ctx.match[1] === "/") {
    return;
  }
  const key = `chat:${ctx.chat.id}:amore`;
  const message = cleanKey(removeDiacritics(ctx.match[1]));
  client.hincrby(key, message, 1);
};

export const recursivelyRemoveMerda = (word: string): string => {
  const replaced = word.replace("mmerda", "merda");
  if (replaced === word) {
    return word.replace("merda", " merda");
  }
  return recursivelyRemoveMerda(replaced);
};

export const cleanMerda = (word: string): string => {
  const sanitized = recursivelyRemoveMerda(removeDiacritics(word));
  const match = /^(.+)\s*merda$/gi.exec(sanitized);
  return cleanKey(match[1]);
};

/**
 * Records a user's expression of displeasure
 * @param ctx
 */
const merda = (ctx: HearsContext<Context>) => {
  if (ctx.match[1] === "/") {
    return;
  }
  const key = `chat:${ctx.chat.id}:merda`;
  if (ctx.match[1].toLowerCase().includes("mmerda")) {
    const message = ctx.match[0].toLowerCase();
    const clean = cleanMerda(message);
    client.hincrby(key, clean, 1);
  } else {
    const message = cleanKey(removeDiacritics(ctx.match[1]));
    client.hincrby(key, message.trim(), 1);
  }
};

/**
 * Prints a summary of the pleasures/displeasures recorded
 * @param keySuffix
 * @returns
 */
const summary = (keySuffix: string, header: string) => {
  return (ctx: HearsContext<Context>) => {
    const key = `chat:${ctx.chat.id}:${keySuffix}`;
    client.hgetall(key, (err, record) => {
      if (err) {
        console.error(err);
        ctx.reply("Something went wrong :(");
      } else {
        const itemsSorted = sortRecord(record);
        const message = prettyPrint(itemsSorted, header);
        ctx.reply(message);
      }
    });
  };
};

export const summaryAmore = summary("amore", "CLASSIFICA DELL'AMORE 😍");
export const summaryMerda = summary("merda", "CLASSIFICA DELLA MERDA 🤢");

export const amoreMerda = new Composer();
amoreMerda.hears(/^(.+)\s*amore$/gi, amore);
amoreMerda.hears(/^[/!]amore$/gi, summaryAmore);
amoreMerda.hears(/^(.+)\s*merda$/gi, merda);
amoreMerda.hears(/^[/!]merda$/gi, summaryMerda);
