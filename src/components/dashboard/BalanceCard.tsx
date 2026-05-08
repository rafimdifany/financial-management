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
          backgroundColor: colors.surfaceContainerLowest,
          borderRadius: radius.xl,
          padding: spacing["2xl"],
          borderWidth: 0,
          // Add ambient shadow as per spec §6.4
          shadowColor: colors.onSurface,
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.04,
          shadowRadius: 32,
          elevation: 4,
        },
      ]}
    >
      <View style={[styles.header, { marginBottom: spacing.xl }]}>
        <View>
          <Text variant="labelSm" style={[styles.eyebrow, { color: colors.onSurfaceVariant }]}>
            TOTAL BALANCE
          </Text>
        </View>
      </View>
      
      <Text 
        variant="displayMd"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        style={[styles.balance, { color: colors.onSurface, marginBottom: spacing.xl }]}
      >
        {formatCurrency(balance)}
      </Text>

      <View
        style={[
          styles.statusPill,
          {
            backgroundColor: netFlow >= 0 ? `${colors.secondary}15` : `${colors.error}15`,
            borderRadius: radius.md,
          },
        ]}
      >
        <Ionicons
          name={netFlow >= 0 ? "trending-up" : "trending-down"}
          size={14}
          color={netFlow >= 0 ? colors.secondary : colors.error}
        />
        <Text variant="labelSm" style={{ color: netFlow >= 0 ? colors.secondary : colors.error }}>
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
    color: "rgba(255,255,255,0.72)",
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
