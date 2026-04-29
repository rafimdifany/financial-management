import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "./Text";
import { TaskStatus } from "../../types/task";

interface Props {
  status: TaskStatus;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<Props> = ({ status, style }) => {
  const { colors, radius } = useTheme();

  const getStatusStyles = () => {
    switch (status) {
      case "todo":
        return {
          backgroundColor: colors.surfaceContainerHigh,
          color: colors.onSurfaceVariant,
          label: "TODO",
        };
      case "in_progress":
        return {
          backgroundColor: `${colors.tertiaryContainer}33`, // 20% opacity
          color: colors.tertiary,
          label: "IN PROGRESS",
        };
      case "done":
        return {
          backgroundColor: `${colors.secondaryContainer}33`, // 20% opacity
          color: colors.secondary,
          label: "DONE",
        };
      default:
        return {
          backgroundColor: colors.surfaceContainerHigh,
          color: colors.onSurfaceVariant,
          label: (status as string).toUpperCase(),
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <View
      style={[
        {
          backgroundColor: styles.backgroundColor,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: radius.md,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text
        variant="labelSm"
        style={{
          color: styles.color,
          textTransform: "uppercase",
          fontWeight: "700",
        }}
      >
        {styles.label}
      </Text>
    </View>
  );
};
