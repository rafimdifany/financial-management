import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "./Text";

export const AppTopBar = () => {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.base,
          paddingHorizontal: spacing.xl,
          paddingBottom: spacing.base,
          backgroundColor: `${colors.surfaceContainerLow}E6`,
          borderBottomColor: colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.brandGroup}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colors.primaryContainer,
              borderRadius: radius.full,
            },
          ]}
        >
          <Text variant="labelSm" style={{ color: colors.primary, fontWeight: "800" }}>
            FS
          </Text>
        </View>
        <Text variant="titleLg" style={{ color: colors.primary }}>
          Financial Sanctuary
        </Text>
      </View>
      <View style={[styles.iconButton, { borderRadius: radius.full }]}>
        <Ionicons name="notifications-outline" size={20} color={colors.onSurfaceVariant} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
