import TelegramBot from "node-telegram-bot-api";
import client from "../redisClient";
import { getUsers } from "./stats/print";
import { prettyPrint } from "./utils/printStandings";
import { sortRecord } from "./utils/sortRecord";

const setKey = (msg: TelegramBot.Message) =>
  `chat:${msg.chat.id}:user:${msg.from.id}:bestemmie`;

const storeBestemmia = (msg: TelegramBot.Message) => {
  client.hincrby(setKey(msg), msg.text.replaceAll("@", ""), 1);
};

const incrCounter = (msg: TelegramBot.Message) => {
  const key = `chat:${msg.chat.id}:user:${msg.from.id}`;
  client.hincrby(key, "bestemmie", 1).then((stats: Number) => {
    if (stats === 1) client.hset(key, "name", msg.from.username);
  });
};

const nameFromID = (msg: TelegramBot.Message) => {
  const key = `chat:${msg.chat.id}:user:${msg.from.id}`;
  return client.hget(key, "name");
};

export const countBestemmia =
  () =>
  (msg: TelegramBot.Message): void => {
    storeBestemmia(msg);
    incrCounter(msg);
  };

export const printUserBestemmie =
  (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const bestemmie = await client.hgetall(setKey(msg));
    const itemsSorted = sortRecord(bestemmie);
    const name = await nameFromID(msg);
    const header = `BESTEMMIE DI ${name} 📿🧎‍♂️`;
    const message = prettyPrint(itemsSorted, header);
    bot.sendMessage(msg.chat.id, message);
  };

export const printBestemmiatori =
  (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const users = await getUsers(msg.chat.id, "bestemmie");
    const sortedUsers = users.sort((a, b) => b.count - a.count);
    const message = prettyPrint(sortedUsers, "FERVIDI CREDENTI  📿🧎‍♂️");
    bot.sendMessage(msg.chat.id, message);
  };
