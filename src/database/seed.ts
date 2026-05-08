import * as SQLite from "expo-sqlite";
import { DEFAULT_CATEGORIES } from "../constants/categories";

export async function seedCategories(db: SQLite.SQLiteDatabase) {
  for (const category of DEFAULT_CATEGORIES) {
    await db.runAsync(
      "INSERT INTO categories (name, icon, color, type, is_default) VALUES (?, ?, ?, ?, ?)",
      [
        category.name,
        category.icon,
        category.color,
        category.type,
        category.is_default,
      ]
    );
  }
}

export async function seedSettings(db: SQLite.SQLiteDatabase) {
  await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
    "theme",
    "dark",
  ]);
  await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
    "currency",
    "IDR",
  ]);
  await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
    "locale",
    "id-ID",
  ]);
  await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
    "db_version",
    "1",
  ]);
}
