import * as TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";

interface User {
  count: number;
  name: string;
}

export const getUsers = async (
  chatId: Number,
  category: string
): Promise<User[]> => {
  let users: User[] = [];
  const keys = await client.keys(`chat:${chatId}:user:*`);
  for (let key of keys) {
    let user = await client.hmget(key, "name", category);
    users.push({ name: user[0], count: +user[1] });
  }
  return users.filter((u) => u.count > 0);
};

export const prettyPrint = (users: User[]): string => {
  let message = `STATS DELL'ERA SANDRO COIS\n\n`;
  for (let u in users) {
    let emojiMedal = "";
    if (u === "0") {
      emojiMedal = "🥇";
    }
    if (u === "1") {
      emojiMedal = "🥈";
    }
    if (u === "2") {
      emojiMedal = "🥉";
    }
    message += `${emojiMedal} ${users[u].name} - ${users[u].count}\n`;
  }
  return message;
};

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message): Promise<void> => {
    const users = await getUsers(msg.chat.id, "stats");
    const sortedUsers = users.sort((a, b) => b.count - a.count);
    const message = prettyPrint(sortedUsers);
    bot.sendMessage(msg.chat.id, message);
  };
