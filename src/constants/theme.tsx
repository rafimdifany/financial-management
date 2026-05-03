import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { darkColors } from "./darkTheme";
import { lightColors } from "./lightTheme";
import { typeScale } from "./typography";
import { spacing, radius } from "./spacing";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useColorScheme } from "react-native";

export type ThemeType = "dark" | "light";

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof darkColors;
  typography: typeof typeScale;
  spacing: typeof spacing;
  radius: typeof radius;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme: storeTheme, updateSetting, fetchSettings } = useSettingsStore();
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const theme: ThemeType = storeTheme === 'system' 
    ? (systemColorScheme || 'dark') 
    : (storeTheme as ThemeType);

  const colors = theme === "dark" ? darkColors : lightColors;
  const isDark = theme === "dark";

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    await updateSetting('theme', newTheme);
  };

  const setTheme = async (newTheme: ThemeType) => {
    await updateSetting('theme', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        typography: typeScale,
        spacing,
        radius,
        isDark,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export * from "./darkTheme";
export * from "./lightTheme";
export * from "./typography";
export * from "./spacing";
