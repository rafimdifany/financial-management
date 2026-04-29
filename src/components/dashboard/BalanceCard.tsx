import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Card } from "../common/Card";
import { Text } from "../common/Text";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";

export const BalanceCard = () => {
  const { colors, spacing } = useTheme();
  const { balance, income, expense } = useDashboardStore();

  return (
    <Card style={styles.container}>
      <View style={[styles.header, { marginBottom: spacing.sm }]}>
        <Text variant="labelMd" style={[styles.label, { color: colors.onSurfaceVariant }]}>
          TOTAL BALANCE
        </Text>
      </View>
      
      <Text 
        variant="headlineLg" 
        style={[styles.balance, { color: colors.onSurface, marginBottom: spacing.xl }]}
      >
        {formatCurrency(balance)}
      </Text>

      <View style={styles.row}>
        <View style={[styles.statContainer, { gap: spacing.sm }]}>
          <View style={[styles.iconWrapper, { backgroundColor: `${colors.secondary}1A` }]}>
            <Ionicons name="arrow-up" size={16} color={colors.secondary} />
          </View>
          <View>
            <Text variant="labelSm" style={{ color: colors.onSurfaceVariant }}>Income</Text>
            <Text variant="titleMd" style={[styles.amount, { color: colors.onSurface }]}>
              {formatCurrency(income)}
            </Text>
          </View>
        </View>

        <View style={[styles.statContainer, { gap: spacing.sm }]}>
          <View style={[styles.iconWrapper, { backgroundColor: `${colors.error}1A` }]}>
            <Ionicons name="arrow-down" size={16} color={colors.error} />
          </View>
          <View>
            <Text variant="labelSm" style={{ color: colors.onSurfaceVariant }}>Expense</Text>
            <Text variant="titleMd" style={[styles.amount, { color: colors.onSurface }]}>
              {formatCurrency(expense)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    // marginBottom moved to inline style
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1.5, // roughly 0.1em
  },
  balance: {
    fontVariant: ["tabular-nums"],
    // marginBottom moved to inline style
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    // gap moved to inline style
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  amount: {
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
});
