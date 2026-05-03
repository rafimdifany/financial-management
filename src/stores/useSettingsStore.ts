import { create } from 'zustand';
import { SettingsState, AppTheme } from '../types/settings';
import { settingsService } from '../services/settingsService';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'dark',
  currency: 'IDR',
  locale: 'id-ID',
  db_version: '1',
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await settingsService.getSettings();
      set({ ...settings });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSetting: async (key, value) => {
    try {
      await settingsService.updateSetting(key, value);
      set({ [key]: value });
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
      throw error;
    }
  },

  resetAllData: async () => {
    try {
      await settingsService.resetData();
    } catch (error) {
      console.error('Failed to reset data:', error);
      throw error;
    }
  }
}));
