import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface Props extends ViewProps {
  level?: 0 | 1 | 2 | 3 | 4;
}

export const Surface: React.FC<Props> = ({ 
  level = 1, 
  style, 
  children, 
  ...props 
}) => {
  const { colors, isDark, radius } = useTheme();

  const getBackgroundColor = () => {
    if (isDark) {
      switch (level) {
        case 0: return colors.surface;
        case 1: return colors.surfaceContainerLow;
        case 2: return colors.surfaceContainer;
        case 3: return colors.surfaceContainerHigh;
        case 4: return colors.surfaceContainerHighest;
        default: return colors.surfaceContainerLow;
      }
    } else {
      switch (level) {
        case 0: return colors.surface;
        case 1: return colors.surfaceContainerLow;
        case 2: return colors.surfaceContainer;
        case 3: return colors.surfaceContainerLowest; // "lifted" in light mode
        case 4: return colors.surfaceContainerHigh;
        default: return colors.surfaceContainerLow;
      }
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: radius.md,
          // Ghost borders §6.4
          borderWidth: isDark ? 0 : 1,
          borderColor: isDark ? "transparent" : `${colors.outlineVariant}26`,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
