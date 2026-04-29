import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { typeScale } from "../../constants/typography";

interface Props extends TextProps {
  variant?: keyof typeof typeScale;
  color?: string;
}

export const Text: React.FC<Props> = ({ 
  variant = "bodyMd", 
  color, 
  style, 
  children, 
  ...props 
}) => {
  const { colors, typography } = useTheme();

  return (
    <RNText
      style={[
        {
          color: color || colors.onSurface,
          ...typography[variant],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
