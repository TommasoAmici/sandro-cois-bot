import * as TelegramBot from "node-telegram-bot-api";
import Cetriolino from "cetriolino";

export default (db: Cetriolino) => (msg: TelegramBot.Message): void => {
  const userId = String(msg.from.id);
  let current = db.get(userId);
  if (current === undefined) {
    current = { count: 0 };
  }
  const stats = { name: msg.from.username, count: current.count + 1 };
  db.set(userId, stats);
};
