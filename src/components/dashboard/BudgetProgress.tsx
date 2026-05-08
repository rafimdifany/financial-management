import React from "react";
import { View, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { Surface } from "../common/Surface";
import { ProgressBar } from "../common/ProgressBar";
import { SectionHeader } from "../common/SectionHeader";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { BudgetWithSpent } from "../../types/budget";

// Removed static Dimensions calculation

const BudgetCard = ({ item, cardWidth }: { item: BudgetWithSpent; cardWidth: number }) => {
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
          width: cardWidth, 
          marginRight: spacing.base,
          padding: spacing.base,
          borderRadius: radius.lg,
        }
      ]}
    >
      <View style={[styles.cardHeader, { marginBottom: spacing.md }]}>
        <View style={[styles.categoryInfo, { gap: spacing.md }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${item.category_color || colors.primary}18`, borderRadius: radius.sm }]}>
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
        style={[styles.progressBar, { marginBottom: spacing.md }]} 
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
  const { colors, spacing, radius } = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.76, 340);
  const { budgetProgress } = useDashboardStore();


  return (
    <View style={styles.container}>
      <View style={{ marginBottom: spacing.base }}>
        <SectionHeader title="Budget" caption="Pantau kategori yang mulai mendekati batas." />
      </View>
      {budgetProgress.length > 0 ? (
        <FlatList
          data={budgetProgress}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BudgetCard item={item} cardWidth={CARD_WIDTH} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: spacing.xl }}
          snapToInterval={CARD_WIDTH + spacing.base}
          decelerationRate="fast"
        />
      ) : (
        <Surface level={1} style={{ padding: spacing.xl, borderRadius: radius.xl, alignItems: 'center' }}>
          <Text variant="bodyMd" style={{ color: colors.onSurfaceVariant }}>Belum ada anggaran bulanan</Text>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical moved to inline style
  },
  card: {
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom moved to inline style
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    // gap moved to inline style
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    // marginBottom moved to inline style
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
