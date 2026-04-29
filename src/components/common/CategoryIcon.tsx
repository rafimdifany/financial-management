import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  icon: string;
  color: string;
  size?: number;
  style?: ViewStyle;
}

export const CategoryIcon: React.FC<Props> = ({
  icon,
  color,
  size = 24,
  style,
}) => {
  const { radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: radius.full,
          backgroundColor: `${color}20`, // 12% - 20% opacity for background
        },
        style,
      ]}
    >
      <Ionicons 
        name={icon as any} 
        size={size} 
        color={color} 
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
