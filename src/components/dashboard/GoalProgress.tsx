import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { Surface } from "../common/Surface";
import { ProgressBar } from "../common/ProgressBar";
import { SectionHeader } from "../common/SectionHeader";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { Goal } from "../../types/goal";

const GoalCard = ({ item }: { item: Goal }) => {
  const { colors, spacing, radius } = useTheme();
  const color = item.color || colors.primary;
  const progress = item.target_amount > 0 ? item.current_amount / item.target_amount : 0;
  const percentage = Math.round(progress * 100);

  return (
    <Surface
      level={1}
      style={[
        styles.card,
        {
          padding: spacing.xl,
          borderRadius: radius.xl,
          borderColor: `${color}4D`,
          gap: spacing.lg,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.goalTitleGroup, { gap: spacing.base }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}22`, borderRadius: radius.lg }]}>
            <Ionicons name={(item.icon as any) || "car-outline"} size={20} color={color} />
          </View>
          <View style={styles.goalText}>
            <Text variant="titleMd" style={{ color: colors.onSurface }}>
              {item.name}
            </Text>
            <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }}>
              Target finansial
            </Text>
          </View>
        </View>
        <View style={[styles.percentPill, { backgroundColor: color }]}>
          <Text variant="labelSm" style={{ color: colors.onPrimary }}>
            {percentage}%
          </Text>
        </View>
      </View>

      <View style={[styles.progressMeta, { gap: spacing.sm }]}>
        <Text variant="labelSm" style={{ color: colors.onSurfaceVariant }}>
          CURRENT PROGRESS
        </Text>
        <Text variant="labelSm" numberOfLines={1} style={{ color }}>
          {formatCurrency(item.current_amount)} / {formatCurrency(item.target_amount)}
        </Text>
      </View>
      <ProgressBar progress={progress} color={color} height={12} />
    </Surface>
  );
};

export const GoalProgress = () => {
  const { spacing } = useTheme();
  const { goals } = useDashboardStore();


  return (
    <View>
      <View style={{ marginBottom: spacing.base }}>
        <SectionHeader title="Savings Goal" actionLabel="View Details" onActionPress={() => {}} />
      </View>
      {goals.length > 0 ? (
        <GoalCard item={goals[0]} />
      ) : (
        <Surface level={1} style={{ padding: spacing.xl, borderRadius: radius.xl, alignItems: 'center' }}>
          <Text variant="bodyMd" style={{ color: colors.onSurfaceVariant }}>Belum ada target tabungan</Text>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalTitleGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  goalText: {
    flex: 1,
  },
  percentPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
