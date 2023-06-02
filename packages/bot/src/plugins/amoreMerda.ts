import { remove as removeDiacritics } from "diacritics";
import { Context, HearsContext } from "grammy";
import client from "../redisClient";
import { prettyPrint } from "./utils/printStandings";
import { sortRecord } from "./utils/sortRecord";

export const cleanKey = (word: string): string => {
  return word.toLowerCase().trim().replace("@", "");
};

/**
 * Records a user's expression of pleasure
 * @param bot
 * @returns void
 */
export const amore = async (ctx: HearsContext<Context>) => {
  if (ctx.match[0] === "/ amore" || ctx.match[0] === "/amore") {
    return;
  }

  const key = `chat:${ctx.chat.id}:amore`;
  const message = cleanKey(removeDiacritics(ctx.match[0]).replace("amore", ""));
  await client.hincrby(key, message, 1);
};

export const recursivelyRemoveMerda = (word: string): string => {
  const replaced = word.replace("mmerda", "merda");
  if (replaced === word) {
    return word.replace("merda", " merda");
  }
  return recursivelyRemoveMerda(replaced);
};

export const cleanMerda = (word: string): string | undefined => {
  const sanitized = recursivelyRemoveMerda(removeDiacritics(word));
  const match = /^(.+)\s*merda$/gi.exec(sanitized);
  if (match === null) {
    return undefined;
  }
  console.log(match);
  return cleanKey(match[1]);
};

/**
 * Records a user's expression of displeasure
 * @param bot
 * @returns void
 */
export const merda = async (ctx: HearsContext<Context>) => {
  if (ctx.match[0] === "/ merda" || ctx.match[0] === "/merda") {
    return;
  }
  const key = `chat:${ctx.chat.id}:merda`;
  if (ctx.match[0].toLowerCase().includes("mmerda")) {
    const message = ctx.match[0].toLowerCase();
    const clean = cleanMerda(message);
    if (clean === undefined) {
      return;
    }
    await client.hincrby(key, clean, 1);
  } else {
    const clean = cleanMerda(ctx.match[0]);
    if (clean === undefined) {
      return;
    }
    await client.hincrby(key, clean.trim(), 1);
  }
};

/**
 * Prints a summary of the pleasures/displeasures recorded
 * @param keySuffix
 * @returns
 */
const summary = (keySuffix: string, header: string) => {
  return async (ctx: Context) => {
    const chatID = ctx.chat?.id;
    if (chatID === undefined) {
      return;
    }

    const key = `chat:${chatID}:${keySuffix}`;
    const record = await client.hgetall(key);
    if (record) {
      const itemsSorted = sortRecord(record);
      const message = prettyPrint(itemsSorted, header);
      await ctx.reply(message);
    } else {
      await ctx.reply("Something went wrong :(");
    }
  };
};

export const summaryAmore = summary("amore", "CLASSIFICA DELL'AMORE 😍");
export const summaryMerda = summary("merda", "CLASSIFICA DELLA MERDA 🤢");
