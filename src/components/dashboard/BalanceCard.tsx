import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Card } from "../common/Card";
import { Text } from "../common/Text";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";

export const BalanceCard = () => {
  const { colors, spacing, radius } = useTheme();
  const { balance, income, expense } = useDashboardStore();
  const netFlow = income - expense;

  return (
    <Card
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
          borderRadius: radius.xl,
          padding: spacing["2xl"],
          borderWidth: 0,
          // Add ambient shadow as per spec §6.4
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 8,
        },
      ]}
    >
      <View style={[styles.header, { marginBottom: spacing.xs }]}>
        <View>
          <Text variant="labelSm" style={[styles.eyebrow, { color: colors.onPrimary }]}>
            TOTAL BALANCE
          </Text>
        </View>
      </View>

      <Text 
        variant="displayMd"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        style={[styles.balance, { color: colors.onPrimary, marginBottom: spacing.lg }]}
      >
        {formatCurrency(balance)}
      </Text>

      <View
        style={[
          styles.statusPill,
          {
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: radius.md,
          },
        ]}
      >
        <Ionicons
          name={netFlow >= 0 ? "trending-up" : "trending-down"}
          size={14}
          color={colors.onPrimary}
        />
        <Text variant="labelSm" style={{ color: colors.onPrimary }}>
          {netFlow >= 0 ? "Surplus bulan ini" : "Defisit bulan ini"}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrow: {
    fontWeight: "800",
    textTransform: "uppercase",
  },
  balance: {
    fontVariant: ["tabular-nums"],
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
