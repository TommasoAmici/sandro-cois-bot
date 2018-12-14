import { Message } from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

const sortUsers = (db: Cetriolino) => {
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

const prettyPrint = users => {
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

export default (bot, db: Cetriolino) => (msg: Message) => {
  const sortedUsers = sortUsers(db);
  const message = prettyPrint(sortedUsers);
  bot.sendMessage(msg.chat.id, message);
};
