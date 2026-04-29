import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { Surface } from "../common/Surface";
import { ProgressBar } from "../common/ProgressBar";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { BudgetWithSpent } from "../../types/budget";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;

const BudgetCard = ({ item }: { item: BudgetWithSpent }) => {
  const { colors, spacing, radius } = useTheme();
  
  const progress = item.amount > 0 ? item.spent / item.amount : 0;
  const percentage = Math.round(progress * 100);
  
  let progressColor = colors.primary;
  if (progress >= 1) {
    progressColor = colors.error;
  } else if (progress >= 0.8) {
    progressColor = colors.tertiary;
  }

  return (
    <Surface 
      level={3} 
      style={[
        styles.card, 
        { 
          width: CARD_WIDTH, 
          marginRight: spacing.base,
          padding: spacing.base,
          borderRadius: radius.lg,
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryInfo}>
          <View style={[styles.iconContainer, { backgroundColor: `${item.category_color || colors.primary}20` }]}>
            <Ionicons 
              name={(item.category_icon as any) || "cart"} 
              size={18} 
              color={item.category_color || colors.primary} 
            />
          </View>
          <Text variant="titleSm" style={{ color: colors.onSurface }}>
            {item.category_name}
          </Text>
        </View>
        <Text variant="labelSm" style={{ color: progress >= 1 ? colors.error : colors.onSurfaceVariant }}>
          {percentage}%
        </Text>
      </View>

      <ProgressBar 
        progress={progress} 
        color={progressColor} 
        style={styles.progressBar} 
      />

      <View style={styles.cardFooter}>
        <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }}>
          <Text variant="bodySm" style={{ color: colors.onSurface, fontWeight: "600" }}>
            {formatCurrency(item.spent)}
          </Text>
          {" / " + formatCurrency(item.amount)}
        </Text>
      </View>
    </Surface>
  );
};

export const BudgetProgress = () => {
  const { spacing } = useTheme();
  const { budgetProgress } = useDashboardStore();

  if (budgetProgress.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSm" style={[styles.title, { marginLeft: spacing.base }]}>
        Budget
      </Text>
      <FlatList
        data={budgetProgress}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BudgetCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.base }}
        snapToInterval={CARD_WIDTH + spacing.base}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 16,
  },
  card: {
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
