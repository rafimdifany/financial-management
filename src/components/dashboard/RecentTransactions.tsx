import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { CategoryIcon } from "../common/CategoryIcon";
import { TransactionWithCategory } from "../../types/transaction";

const TransactionItem = ({ item }: { item: TransactionWithCategory }) => {
  const { colors, spacing } = useTheme();
  const isIncome = item.type === "income";

  return (
    <View style={[styles.item, { marginBottom: spacing.base }]}>
      <CategoryIcon 
        icon={item.category_icon} 
        color={item.category_color} 
        size={40} 
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text variant="titleSm" style={{ color: colors.onSurface, flexShrink: 1, marginRight: spacing.sm }} numberOfLines={1}>
            {item.description || item.category_name}
          </Text>
          <Text 
            variant="titleSm" 
            style={[
              styles.amount, 
              { color: isIncome ? colors.secondary : colors.onSurface }
            ]}
          >
            {isIncome ? "+ " : "- "}
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <Text variant="labelSm" style={{ color: colors.onSurfaceVariant }}>
          {formatDate(item.date)} • {item.category_name}
        </Text>
      </View>
    </View>
  );
};

export const RecentTransactions = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<any>();
  const { recentTransactions } = useDashboardStore();

  if (recentTransactions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.base, marginVertical: spacing.base }]}>
      <View style={[styles.header, { marginBottom: spacing.base }]}>
        <Text variant="headlineSm" style={{ color: colors.onSurface }}>Recent Transactions</Text>
        <Pressable onPress={() => navigation.navigate("TransactionsTab")}>
          <Text variant="labelMd" style={{ color: colors.primary }}>See All</Text>
        </Pressable>
      </View>

      {recentTransactions.slice(0, 5).map((item) => (
        <TransactionItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  amount: {
    fontVariant: ["tabular-nums"],
  },
});
