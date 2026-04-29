import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "./Text";
import { Button } from "./Button";

interface Props {
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<Props> = ({
  title,
  message,
  icon = "document-text-outline",
  actionTitle,
  onAction,
  style,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      <Ionicons 
        name={icon} 
        size={64} 
        color={colors.outline} 
        style={{ marginBottom: spacing.lg }}
      />
      <Text variant="titleLg" style={{ textAlign: "center", marginBottom: spacing.sm }}>
        {title}
      </Text>
      <Text 
        variant="bodyMd" 
        style={{ textAlign: "center", color: colors.onSurfaceVariant, marginBottom: spacing.xl }}
      >
        {message}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} variant="secondary" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
