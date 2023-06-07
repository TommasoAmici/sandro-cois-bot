import type Database from "bun:sqlite";
import fs from "node:fs";
import path from "node:path";

/**
 * Utility function to apply database migrations.
 */
export async function migrate(db: Database) {
  console.info("Applying database migrations");
  console.time("Database migrations applied");
  db.run("PRAGMA foreign_keys = ON;");
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  const currentMigrationQuery = db.prepare(
    "SELECT name FROM migrations ORDER BY created_at DESC LIMIT 1",
  );
  const currentMigration = currentMigrationQuery.get() as null | {
    name: string;
  };

  const migrations = fs
    .readdirSync(path.join(import.meta.dir, "migrations"))
    .sort();

  for (const migration of migrations) {
    if (
      currentMigration &&
      (currentMigration.name === migration || currentMigration.name > migration)
    ) {
      console.log("\t%s: skipped", migration);
      continue;
    }
    const sql = await Bun.file(
      path.join(import.meta.dir, "migrations", migration),
    ).text();
    const statements = sql.split(";");
    for (const statement of statements) {
      if (!statement.trim()) {
        continue;
      }
      db.run(statement);
    }
    db.run("INSERT INTO migrations (name) VALUES (?)", [migration]);
    console.log("\t%s: applied", migration);
  }

  console.timeEnd("Database migrations applied");
}
