module.exports = (bot, db) => msg => {
  const userId = msg.from.id;
  let current = db.get(userId);
  if (current === undefined) {
    current = { count: 0 };
  }
  const stats = {
    name: msg.from.username,
    count: current.count + 1
  };
  db.set(userId, stats);
};
