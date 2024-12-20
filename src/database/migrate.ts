import type Database from "bun:sqlite";
import fs from "node:fs";
import path from "node:path";

/**
 * Utility function to apply database migrations.
 */
export async function migrate(db: Database) {
  console.info("Applying database migrations");
  console.group();
  console.time("Database migrations applied");
  db.run("PRAGMA foreign_keys = ON;");
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  const currentMigrationQuery = db.prepare<{ name: string }, []>(
    "SELECT name FROM migrations",
  );
  const _appliedMigrations = currentMigrationQuery.all();
  const appliedMigrations = new Set(
    _appliedMigrations.map((migration) => migration.name),
  );

  const migrations = fs
    .readdirSync(path.join(import.meta.dir, "migrations"))
    .sort();

  for (const migration of migrations) {
    if (appliedMigrations.has(migration)) {
      console.log("%s: skipped", migration);
      continue;
    }
    const sql = await Bun.file(
      path.join(import.meta.dir, "migrations", migration),
    ).text();
    const statements = sql.split(";");
    db.run("BEGIN;");
    for (const statement of statements) {
      if (!statement.trim()) {
        continue;
      }
      db.run(statement);
    }
    db.run("INSERT INTO migrations (name) VALUES (?)", [migration]);
    db.run("COMMIT;");
    console.log("%s: applied", migration);
  }
  console.groupEnd();
  console.timeEnd("Database migrations applied");
}
