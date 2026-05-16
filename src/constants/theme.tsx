import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { darkColors } from "./darkTheme";
import { lightColors } from "./lightTheme";
import { typeScale } from "./typography";
import { spacing, radius } from "./spacing";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useColorScheme } from "react-native";

export type ThemeType = "dark" | "light" | "system";

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

  const theme: ThemeType = storeTheme as ThemeType;
  
  const resolvedTheme = theme === 'system' 
    ? (systemColorScheme || 'dark') 
    : theme;

  const colors = resolvedTheme === "dark" ? darkColors : lightColors;
  const isDark = resolvedTheme === "dark";

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
