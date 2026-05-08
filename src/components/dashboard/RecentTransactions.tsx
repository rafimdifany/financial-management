import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { CategoryIcon } from "../common/CategoryIcon";
import { TransactionWithCategory } from "../../types/transaction";
import { Surface } from "../common/Surface";
import { SectionHeader } from "../common/SectionHeader";

const TransactionItem = ({ item }: { item: TransactionWithCategory }) => {
  const { colors, spacing } = useTheme();
  const isIncome = item.type === "income";

  return (
    <View style={[styles.item, { paddingVertical: spacing.md }]}>
      <CategoryIcon 
        icon={item.category_icon} 
        color={item.category_color} 
        size={36} 
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text variant="titleSm" style={{ color: colors.onSurface, flexShrink: 1, marginRight: spacing.sm }} numberOfLines={1}>
            {item.description || item.category_name}
          </Text>
          <Text 
            variant="titleSm" 
            numberOfLines={1}
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
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<any>();
  const { recentTransactions } = useDashboardStore();


  return (
    <View style={styles.container}>
      <View style={{ marginBottom: spacing.base }}>
        <SectionHeader
          title="Transaksi Terbaru"
          caption="Aktivitas terakhir yang tercatat."
          actionLabel="Lihat"
          onActionPress={() => navigation.navigate("TransactionsTab")}
        />
      </View>

      <View>
        <Surface level={1} style={[styles.listPanel, { borderRadius: radius.xl, paddingHorizontal: spacing.base }]}>
          {recentTransactions.length > 0 ? (
            recentTransactions.slice(0, 5).map((item, index) => (
              <View
                key={item.id}
              >
                <TransactionItem item={item} />
              </View>
            ))
          ) : (
            <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
              <Text variant="bodyMd" style={{ color: colors.onSurfaceVariant }}>Belum ada transaksi</Text>
            </View>
          )}
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  listPanel: {
    overflow: "hidden",
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
    maxWidth: 132,
  },
});
