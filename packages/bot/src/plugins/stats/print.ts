import TelegramBot from "node-telegram-bot-api";
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

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const users = await getUsers(msg.chat.id, "stats");
    const sortedUsers = users.sort((a, b) => b.count - a.count);
    const message = prettyPrint(sortedUsers);
    bot.sendMessage(msg.chat.id, message);
  };
