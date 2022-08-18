import { Composer } from "grammy";
import client from "../redisClient";
import { prettyPrint } from "./utils/printStandings";

interface User {
  count: number;
  name: string;
}

export const getUsers = async (
  chatId: Number,
  category: string,
): Promise<User[]> => {
  const users: User[] = [];
  const scanned: { [k: string]: boolean } = {};
  const stream = client.scanStream({ match: `chat:${chatId}:user:*` });
  for await (const keys of stream) {
    for (let key of keys) {
      if (scanned[key]) {
        continue;
      }
      let user = await client.hmget(key, "name", category);
      users.push({ name: user[0], count: +user[1] });
      scanned[key] = true;
    }
  }
  return users.filter(u => u.count > 0);
};

export const stats = new Composer();

stats.hears(/^[/!]stats(?:@\w+)?$/i, async ctx => {
  const users = await getUsers(ctx.chat.id, "stats");
  const sortedUsers = users.sort((a, b) => b.count - a.count);
  const message = prettyPrint(sortedUsers);
  ctx.reply(message);
});

stats.on("message", ctx => {
  const key = `chat:${ctx.chat.id}:user:${ctx.from.id}`;
  client.hincrby(key, "stats", 1).then((stats: Number) => {
    if (stats === 1) {
      client.hset(key, "name", ctx.msg.from.username);
    }
  });
});
