import React, { createContext, useContext, useState, ReactNode } from "react";
import { darkColors } from "./darkTheme";
import { lightColors } from "./lightTheme";
import { typeScale } from "./typography";
import { spacing, radius } from "./spacing";

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
  const [theme, setThemeState] = useState<ThemeType>("dark");

  const colors = theme === "dark" ? darkColors : lightColors;
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
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
