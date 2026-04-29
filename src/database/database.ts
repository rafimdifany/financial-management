import * as SQLite from "expo-sqlite";
import * as initialMigration from "./migrations/001_initial";

let db: SQLite.SQLiteDatabase | null = null;

const DATABASE_NAME = "finpro.db";

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await runMigrations(db);
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase) {
  // Create _migrations table if it doesn't exist
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Get current version
  const result = await database.getFirstAsync<{ version: number }>(
    "SELECT MAX(version) as version FROM _migrations"
  );
  const currentVersion = result?.version ?? 0;

  // Migration 1: Initial
  if (currentVersion < 1) {
    try {
      await initialMigration.up(database);
      await database.runAsync(
        "INSERT INTO _migrations (version, name) VALUES (?, ?)",
        [1, "001_initial"]
      );
      console.log("Migration 1 (initial) applied successfully.");
    } catch (error) {
      console.error("Migration 1 failed:", error);
      throw error;
    }
  }

  // Add more migrations here as currentVersion increases
}
