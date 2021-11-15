import { remove as removeDiacritics } from "diacritics";
import * as TelegramBot from "node-telegram-bot-api";
import client from "../redisClient";
import { prettyPrint } from "./utils/printStandings";

const init = (keySuffix: string) => {
  return () => (msg: TelegramBot.Message, match: RegExpMatchArray) => {
    const key = `chat:${msg.chat.id}:${keySuffix}`;
    const message = removeDiacritics(match[1]).toLowerCase();
    client.hincrby(key, message, 1);
  };
};

/**
 * Records a user's expression of pleasure
 * @param bot
 * @returns void
 */
export const amore = init("amore");

/**
 * Records a user's expression of displeasure
 * @param bot
 * @returns void
 */
export const merda = init("merda");

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
