import { Database } from "bun:sqlite";

export const db = new Database(process.env.DATABASE_PATH ?? "data/bot.sqlite", {
  create: true,
});
