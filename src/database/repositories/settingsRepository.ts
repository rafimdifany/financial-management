import { getDatabase } from '../database';
import { seedCategories, seedSettings } from '../seed';
import { AppSettings, AppTheme } from '../../types/settings';

export const settingsRepository = {
  async getAll(): Promise<AppSettings> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
      'SELECT key, value FROM settings'
    );
    
    const settings: Partial<AppSettings> = {};
    rows.forEach(row => {
      settings[row.key as keyof AppSettings] = row.value as any;
    });

    return {
      theme: (settings.theme as AppTheme) || 'dark',
      currency: settings.currency || 'IDR',
      locale: settings.locale || 'id-ID',
      db_version: settings.db_version || '1',
    };
  },

  async update(key: string, value: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  },

  async resetAllData(): Promise<void> {
    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM transactions');
      await db.runAsync('DELETE FROM tasks');
      await db.runAsync('DELETE FROM goals');
      await db.runAsync('DELETE FROM budgets');
      await db.runAsync('DELETE FROM categories');
      await db.runAsync('DELETE FROM settings');
      
      await seedCategories(db);
      await seedSettings(db);
    });
  }
};
