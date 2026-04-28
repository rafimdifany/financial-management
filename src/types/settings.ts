export type SettingKey = "theme" | "currency" | "locale" | "db_version";

export interface Setting {
  key: SettingKey;
  value: string;
}
