import * as SQLite from "expo-sqlite";
import { seedCategories, seedSettings } from "../seed";

export async function up(db: SQLite.SQLiteDatabase) {
  // 1. Create categories table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      icon          TEXT,
      color         TEXT,
      type          TEXT NOT NULL,
      is_default    INTEGER DEFAULT 0,
      created_at    TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
  `);

  // 2. Create transactions table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      amount        REAL NOT NULL,
      type          TEXT NOT NULL,
      category_id   INTEGER,
      description   TEXT,
      date          TEXT NOT NULL,
      created_at    TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
  `);

  // 3. Create tasks table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT NOT NULL,
      description   TEXT,
      status        TEXT DEFAULT 'todo',
      priority      TEXT DEFAULT 'medium',
      due_date      TEXT,
      created_at    TEXT DEFAULT (datetime('now')),
      updated_at    TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
  `);

  // 4. Create budgets table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budgets (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id   INTEGER NOT NULL,
      amount        REAL NOT NULL,
      period        TEXT DEFAULT 'monthly',
      created_at    TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category_id);
  `);

  // 5. Create goals table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS goals (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT NOT NULL,
      target_amount   REAL NOT NULL,
      current_amount  REAL DEFAULT 0,
      icon            TEXT,
      color           TEXT,
      deadline        TEXT,
      created_at      TEXT DEFAULT (datetime('now'))
    );
  `);

  // 6. Create settings table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key    TEXT PRIMARY KEY,
      value  TEXT NOT NULL
    );
  `);

  // Seed Categories
  await seedCategories(db);

  // Seed Settings
  await seedSettings(db);
}
