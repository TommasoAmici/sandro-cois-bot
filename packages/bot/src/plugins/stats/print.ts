import { Context, HearsContext } from "grammy";
import client from "../../redisClient";
import { prettyPrint } from "../utils/printStandings";

interface User {
  count: number;
  name: string;
}

export const getUsers = async (
  chatId: Number,
  category: string,
): Promise<User[]> => {
  const users: User[] = [];
  const scanned: Record<string, boolean> = {};
  const stream = client.scanStream({ match: `chat:${chatId}:user:*` });
  for await (const keys of stream) {
    for (let key of keys) {
      if (scanned[key]) {
        continue;
      }
      let user = await client.hmget(key, "name", category);
      if (user[0] === null || user[1] === null) {
        continue;
      }
      users.push({ name: user[0], count: parseInt(user[1]) });
      scanned[key] = true;
    }
  }
  return users.filter(u => u.count > 0);
};

export default async (ctx: HearsContext<Context>) => {
  const users = await getUsers(ctx.chat.id, "stats");
  const sortedUsers = users.sort((a, b) => b.count - a.count);
  const message = prettyPrint(sortedUsers);
  await ctx.reply(message);
};
