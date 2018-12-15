import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

interface User {
  count: number;
  name: string;
}

const sortUsers = (db: Cetriolino): User[] => {
  const keys = db.keys();
  let users = [];
  for (let k in keys) {
    let key = keys[k];
    users.push(db.get(key));
  }
  const sortedUsers = users.sort((a, b) => {
    return b.count - a.count;
  });
  return sortedUsers;
};

const prettyPrint = (users: User[]): string => {
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

export default (bot: TelegramBot, db: Cetriolino) => (
  msg: TelegramBot.Message
): void => {
  const sortedUsers = sortUsers(db);
  const message = prettyPrint(sortedUsers);
  bot.sendMessage(msg.chat.id, message);
};
