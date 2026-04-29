import React, { useEffect } from "react";
import { ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { BalanceCard } from "../../components/dashboard/BalanceCard";
import { BudgetProgress } from "../../components/dashboard/BudgetProgress";
import { GoalProgress } from "../../components/dashboard/GoalProgress";
import { RecentTransactions } from "../../components/dashboard/RecentTransactions";
import { PendingTasks } from "../../components/dashboard/PendingTasks";
import { useDashboardStore } from "../../stores/useDashboardStore";

export const DashboardScreen = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { fetchAll, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.surface }]}
      contentContainerStyle={[
        styles.content, 
        { 
          paddingTop: insets.top + spacing.base,
          paddingBottom: 100 + insets.bottom, // extra padding for tab bar
        }
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={isLoading} 
          onRefresh={fetchAll} 
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={{ paddingHorizontal: spacing.base }}>
        <BalanceCard />
      </View>
      
      <BudgetProgress />
      <GoalProgress />
      <RecentTransactions />
      <PendingTasks />
      
      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
});
