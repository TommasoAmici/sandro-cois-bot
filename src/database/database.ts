import { Database } from "bun:sqlite";

export const db = new Database(process.env.DATABASE_PATH ?? "bot.sqlite", {
  create: true,
});
