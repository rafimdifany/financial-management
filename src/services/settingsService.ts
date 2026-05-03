import { settingsRepository } from '../database/repositories/settingsRepository';
import { AppSettings } from '../types/settings';

export const settingsService = {
  async getSettings(): Promise<AppSettings> {
    return settingsRepository.getAll();
  },

  async updateSetting(key: string, value: string): Promise<void> {
    await settingsRepository.update(key, value);
  },

  async resetData(): Promise<void> {
    await settingsRepository.resetAllData();
  }
};
