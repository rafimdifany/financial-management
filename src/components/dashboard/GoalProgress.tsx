import React from "react";
import { View, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { Surface } from "../common/Surface";
import { ProgressBar } from "../common/ProgressBar";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { Goal } from "../../types/goal";

const GoalCard = ({ item, cardWidth }: { item: Goal; cardWidth: number }) => {
  const { colors, spacing, radius } = useTheme();
  const progress = item.target_amount > 0 ? item.current_amount / item.target_amount : 0;
  const percentage = Math.round(progress * 100);

  return (
    <Surface 
      level={2} 
      style={[
        styles.card, 
        { 
          width: cardWidth, 
          marginRight: spacing.base,
          padding: spacing.base,
          borderRadius: radius.lg,
        }
      ]}
    >
      <View style={[styles.cardHeader, { marginBottom: spacing.sm }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color || colors.primary}20` }]}>
          <Ionicons 
            name={(item.icon as any) || "star"} 
            size={18} 
            color={item.color || colors.primary} 
          />
        </View>
        <View style={styles.goalInfo}>
          <Text variant="titleSm" style={{ color: colors.onSurface }}>{item.name}</Text>
          <Text variant="labelSm" style={{ color: colors.onSurfaceVariant }}>{percentage}%</Text>
        </View>
      </View>

      <ProgressBar 
        progress={progress} 
        color={item.color || colors.primary} 
        style={{ marginBottom: spacing.sm }} 
      />

      <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }}>
        <Text variant="bodySm" style={{ color: colors.onSurface, fontWeight: "600" }}>
          {formatCurrency(item.current_amount)}
        </Text>
        {" / " + formatCurrency(item.target_amount)}
      </Text>
    </Surface>
  );
};

export const GoalProgress = () => {
  const { spacing } = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const CARD_WIDTH = SCREEN_WIDTH * 0.7;
  const { goals } = useDashboardStore();

  if (goals.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSm" style={[styles.title, { marginLeft: spacing.xl, marginBottom: spacing.base }]}>
        Goals
      </Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GoalCard item={item} cardWidth={CARD_WIDTH} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.xl }}
        snapToInterval={CARD_WIDTH + spacing.base}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {},
  card: {
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  goalInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
