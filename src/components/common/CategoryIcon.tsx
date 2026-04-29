import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  icon: string | null;
  color: string | null;
  size?: number;
  style?: ViewStyle;
}

export const CategoryIcon: React.FC<Props> = ({
  icon,
  color,
  size = 24,
  style,
}) => {
  const { radius, colors } = useTheme();
  const finalColor = color || colors.primary;
  const finalIcon = icon || "cart";

  return (
    <View
      style={[
        styles.container,
        {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: radius.full,
          backgroundColor: `${finalColor}33`, // 20% opacity for background
        },
        style,
      ]}
    >
      <Ionicons 
        name={finalIcon as any} 
        size={size} 
        color={finalColor} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
