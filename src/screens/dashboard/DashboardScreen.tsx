import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Text } from "../../components/common/Text";
import { useTheme } from "../../hooks/useTheme";
import { BalanceCard } from "../../components/dashboard/BalanceCard";
import { BudgetProgress } from "../../components/dashboard/BudgetProgress";
import { GoalProgress } from "../../components/dashboard/GoalProgress";
import { RecentTransactions } from "../../components/dashboard/RecentTransactions";
import { PendingTasks } from "../../components/dashboard/PendingTasks";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { Surface } from "../../components/common/Surface";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/formatCurrency";

const DashboardMetric = ({
  icon,
  label,
  value,
  tone,
  growth,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tone: string;
  growth?: string;
}) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <Surface
      level={1}
      style={[
        styles.metric,
        {
          padding: spacing.md,
          borderRadius: radius.md,
        },
      ]}
    >
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: `${tone}18`, borderRadius: radius.md }]}>
          <Ionicons name={icon} size={16} color={tone} />
        </View>
        {growth && (
          <View style={[styles.growthPill, { backgroundColor: `${tone}12` }]}>
            <Text variant="labelSm" style={{ color: tone, fontWeight: '700' }}>{growth}</Text>
          </View>
        )}
      </View>
      <Text variant="labelSm" style={{ color: colors.onSurfaceVariant, textTransform: 'uppercase', fontWeight: '800' }}>
        {label}
      </Text>
      <Text variant="titleLg" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={{ color: colors.onSurface }}>
        {value}
      </Text>
    </Surface>
  );
};

export const DashboardScreen = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { fetchAll, isLoading, income, expense } = useDashboardStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAll();
    setIsRefreshing(false);
  };

  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good evening");
    else setGreeting("Good night");

    setCurrentDate(format(new Date(), "EEEE, d MMMM yyyy"));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView 
        style={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.content, 
          { 
            paddingTop: insets.top + spacing.xl,
            paddingBottom: 132 
          }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh} 
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
      >
        <View style={[styles.main, { padding: spacing.xl, gap: spacing["2xl"] }]}>
          <View>
            <Text variant="headlineLg" style={{ color: colors.onSurface }}>{greeting}, Rafi</Text>
            <Text variant="bodyMd" style={{ color: colors.onSurfaceVariant, marginTop: 2 }}>
              {currentDate}
            </Text>
          </View>

          <BalanceCard />

          <View style={[styles.incomeExpenseGrid, { gap: spacing.base }]}>
            <DashboardMetric
              icon="arrow-down-outline"
              label="Income"
              value={formatCurrency(income)}
              tone={colors.secondary}
              growth="+12%"
            />
            <DashboardMetric
              icon="arrow-up-outline"
              label="Expense"
              value={formatCurrency(expense)}
              tone={colors.error}
              growth="-5%"
            />
          </View>

          <GoalProgress />
          <BudgetProgress />
          <RecentTransactions />
          <PendingTasks />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  main: {
    width: "100%",
  },
  incomeExpenseGrid: {
    flexDirection: "row",
  },
  metric: {
    flex: 1,
    gap: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  metricIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  growthPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
