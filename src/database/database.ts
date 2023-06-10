import { Database } from "bun:sqlite";

export const db = new Database(process.env.DATABASE_PATH ?? "bot.sqlite", {
  create: true,
});

if (process.env.SQLITE_EXTENSIONS) {
  const extensions = process.env.SQLITE_EXTENSIONS.split(",");
  for (const extension of extensions) {
    db.loadExtension(extension);
  }
}
