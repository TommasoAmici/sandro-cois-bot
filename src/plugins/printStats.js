const sortUsers = db => {
  const keys = db.keys();
  let users = [];
  for (k in keys) {
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
  for (u in users) {
    let emojiMedal = "";
    if (u == 0) {
      emojiMedal = "🥇";
    }
    if (u == 1) {
      emojiMedal = "🥈";
    }
    if (u == 2) {
      emojiMedal = "🥉";
    }
    message += `${emojiMedal} ${users[u].name} - ${users[u].count}\n`;
  }
  return message;
};

module.exports = (bot, db) => msg => {
  const chatId = msg.chat.id;
  const sortedUsers = sortUsers(db);
  const message = prettyPrint(sortedUsers);
  bot.sendMessage(chatId, message);
};
