import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "./Text";

interface Props {
  title: string;
  caption?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<Props> = ({
  title,
  caption,
  actionLabel,
  onActionPress,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.sm }]}>
      <View style={styles.textBlock}>
        <Text variant="titleLg" style={{ color: colors.onSurface }}>
          {title}
        </Text>
        {caption ? (
          <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }}>
            {caption}
          </Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: colors.surfaceContainerHigh,
              opacity: pressed ? 0.72 : 1,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Text variant="labelMd" style={{ color: colors.primary }}>
            {actionLabel}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textBlock: {
    flex: 1,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
});
