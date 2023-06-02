import { Context, HearsContext } from "grammy";
import client from "../redisClient";
import { getUsers } from "./stats/print";
import { prettyPrint } from "./utils/printStandings";
import { sortRecord } from "./utils/sortRecord";

const userKey = (ctx: HearsContext<Context>) =>
  `chat:${ctx.chat.id}:user:${ctx.from?.id}`;

const setKey = (ctx: HearsContext<Context>) => `${userKey(ctx)}:bestemmie`;

const storeBestemmia = async (ctx: HearsContext<Context>) => {
  const text = ctx.msg?.text;
  if (text === undefined) {
    return;
  }
  await client.hincrby(setKey(ctx), text.replaceAll("@", ""), 1);
};

const incrCounter = async (ctx: HearsContext<Context>) => {
  const key = userKey(ctx);
  const stats = await client.hincrby(key, "bestemmie", 1);
  const username = ctx.from?.username;
  if (stats === 1 && username) {
    await client.hset(key, "name", username);
  }
};

const nameFromID = (ctx: HearsContext<Context>) => {
  const key = userKey(ctx);
  return client.hget(key, "name");
};

export const countBestemmia = async (ctx: HearsContext<Context>) => {
  await storeBestemmia(ctx);
  await incrCounter(ctx);
};

export const printUserBestemmie = async (ctx: HearsContext<Context>) => {
  const bestemmie = await client.hgetall(setKey(ctx));
  const itemsSorted = sortRecord(bestemmie);
  const name = await nameFromID(ctx);
  const header = `BESTEMMIE DI ${name} 📿🧎‍♂️`;
  const message = prettyPrint(itemsSorted, header);
  await ctx.reply(message);
};

export const printBestemmiatori = async (ctx: HearsContext<Context>) => {
  const users = await getUsers(ctx.chat.id, "bestemmie");
  const sortedUsers = users.sort((a, b) => b.count - a.count);
  const message = prettyPrint(sortedUsers, "FERVIDI CREDENTI  📿🧎‍♂️");
  await ctx.reply(message);
};
