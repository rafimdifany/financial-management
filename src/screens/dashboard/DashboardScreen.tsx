import React, { useEffect } from "react";
import { ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { BalanceCard } from "../../components/dashboard/BalanceCard";
import { BudgetProgress } from "../../components/dashboard/BudgetProgress";
import { useDashboardStore } from "../../stores/useDashboardStore";

export const DashboardScreen = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { fetchAll, refreshSummary, isLoading } = useDashboardStore();

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
      
      {/* Add other sections here as they are implemented (Recent Transactions, Tasks, etc.) */}
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
