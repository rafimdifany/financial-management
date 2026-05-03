export type AppTheme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: AppTheme;
  currency: string;
  locale: string;
  db_version: string;
}

export interface SettingsState extends AppSettings {
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateSetting: (key: keyof AppSettings, value: string) => Promise<void>;
  resetAllData: () => Promise<void>;
}
