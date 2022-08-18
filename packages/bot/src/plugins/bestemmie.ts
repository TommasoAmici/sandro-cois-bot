import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";
import client from "../redisClient";
import { getUsers } from "./stats";
import { prettyPrint } from "./utils/printStandings";
import { sortRecord } from "./utils/sortRecord";

const userKey = (ctx: HearsContext<Context>) =>
  `chat:${ctx.chat.id}:user:${ctx.msg.from.id}`;

const setKey = (ctx: HearsContext<Context>) => `${userKey(ctx)}:bestemmie`;

const storeBestemmia = (ctx: HearsContext<Context>) => {
  client.hincrby(setKey(ctx), ctx.msg.text.replaceAll("@", ""), 1);
};

const incrCounter = (ctx: HearsContext<Context>) => {
  const key = userKey(ctx);
  client.hincrby(key, "bestemmie", 1).then((stats: Number) => {
    if (stats === 1) client.hset(key, "name", ctx.msg.from.username);
  });
};

const nameFromID = (ctx: HearsContext<Context>) => {
  const key = userKey(ctx);
  return client.hget(key, "name");
};

const countBestemmia = (ctx: HearsContext<Context>) => {
  storeBestemmia(ctx);
  incrCounter(ctx);
};

const printUserBestemmie = async (ctx: HearsContext<Context>) => {
  const bestemmie = await client.hgetall(setKey(ctx));
  const itemsSorted = sortRecord(bestemmie);
  const name = await nameFromID(ctx);
  const header = `BESTEMMIE DI ${name} 📿🧎‍♂️`;
  const message = prettyPrint(itemsSorted, header);
  ctx.reply(message);
};

const printBestemmiatori = async (ctx: HearsContext<Context>) => {
  const users = await getUsers(ctx.chat.id, "bestemmie");
  const sortedUsers = users.sort((a, b) => b.count - a.count);
  const message = prettyPrint(sortedUsers, "FERVIDI CREDENTI  📿🧎‍♂️");
  ctx.reply(message);
};

export const bestemmie = new Composer();
bestemmie.hears(
  /((porc(o|a)d?)|(mannaggia( al? )?)|\b)(dio|gesù|cristo|madonna|padre pio|san(ta|to|ti|t')? \w+)( \w+)?/i,
  countBestemmia,
);
bestemmie.hears(/^[/!]le_mie_bestemmie$/i, printUserBestemmie);
bestemmie.hears(/^[/!]bestemmiatori$/i, printBestemmiatori);
