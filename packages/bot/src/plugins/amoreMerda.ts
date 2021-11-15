import { remove as removeDiacritics } from "diacritics";
import TelegramBot from "node-telegram-bot-api";
import client from "../redisClient";
import { prettyPrint } from "./utils/printStandings";

export const cleanKey = (word: string): string => {
  return word.toLowerCase().trim().replace("@", "");
};

/**
 * Records a user's expression of pleasure
 * @param bot
 * @returns void
 */
export const amore =
  () => (msg: TelegramBot.Message, match: RegExpMatchArray) => {
    if (match[1] === "/") return;
    const key = `chat:${msg.chat.id}:amore`;
    const message = cleanKey(removeDiacritics(match[1]));
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
 * @param bot
 * @returns void
 */
export const merda =
  () => (msg: TelegramBot.Message, match: RegExpMatchArray) => {
    if (match[1] === "/") return;
    const key = `chat:${msg.chat.id}:merda`;
    if (match[1].toLowerCase().includes("mmerda")) {
      const message = match[0].toLowerCase();
      const clean = cleanMerda(message);
      client.hincrby(key, clean, 1);
    } else {
      const message = cleanKey(removeDiacritics(match[1]));
      client.hincrby(key, message.trim(), 1);
    }
  };

/**
 * Prints a summary of the pleasures/displeasures recorded
 * @param keySuffix
 * @returns
 */
const summary = (keySuffix: string, header: string) => {
  return (bot: TelegramBot) =>
    (msg: TelegramBot.Message): void => {
      const key = `chat:${msg.chat.id}:${keySuffix}`;
      client.hgetall(key, (err, record) => {
        if (err) {
          console.error(err);
          bot.sendMessage(msg.chat.id, "Something went wrong :(");
        } else {
          const items = Object.keys(record).map((key) => ({
            name: key,
            count: parseInt(record[key]),
          }));
          const itemsSorted = items.sort((a, b) => b.count - a.count);
          const message = prettyPrint(itemsSorted, header);
          bot.sendMessage(msg.chat.id, message);
        }
      });
    };
};

export const summaryAmore = summary("amore", "CLASSIFICA DELL'AMORE 😍");
export const summaryMerda = summary("merda", "CLASSIFICA DELLA MERDA 🤢");

export default {
  amore,
  merda,
  summaryAmore,
  summaryMerda,
};
