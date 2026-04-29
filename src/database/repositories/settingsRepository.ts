import { getDatabase } from "../database";
import { Setting, SettingKey } from "../../types/settings";

export const settingsRepository = {
  async get(key: SettingKey): Promise<string | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Setting>("SELECT * FROM settings WHERE key = ?", [
      key,
    ]);
    return result?.value || null;
  },

  async set(key: SettingKey, value: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
      key,
      value,
    ]);
  },

  async getAll(): Promise<Setting[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Setting>("SELECT * FROM settings");
  },

  async resetAll(): Promise<void> {
    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM settings");
      await db.runAsync("INSERT INTO settings (key, value) VALUES (?, ?)", ["theme", "dark"]);
      await db.runAsync("INSERT INTO settings (key, value) VALUES (?, ?)", [
        "currency",
        "IDR",
      ]);
      await db.runAsync("INSERT INTO settings (key, value) VALUES (?, ?)", [
        "locale",
        "id-ID",
      ]);
      await db.runAsync("INSERT INTO settings (key, value) VALUES (?, ?)", [
        "db_version",
        "1",
      ]);
    });
  },
};
