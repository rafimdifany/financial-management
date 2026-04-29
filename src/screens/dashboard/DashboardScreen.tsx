import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Text } from "../../components/common/Text";
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

  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");

    setCurrentDate(format(new Date(), "MMMM yyyy", { locale: id }));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [])
  );

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
      <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing["3xl"] }}>
        <Text variant="headlineSm" style={{ color: colors.onSurface }}>{greeting}</Text>
        <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, textTransform: "uppercase", marginTop: 4 }}>
          {currentDate}
        </Text>
      </View>

      <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing["3xl"] }}>
        <BalanceCard />
      </View>
      
      <View style={{ marginBottom: spacing["3xl"] }}>
        <BudgetProgress />
      </View>

      <View style={{ marginBottom: spacing["3xl"] }}>
        <GoalProgress />
      </View>

      <View style={{ marginBottom: spacing["3xl"] }}>
        <RecentTransactions />
      </View>

      <View style={{ marginBottom: spacing["3xl"] }}>
        <PendingTasks />
      </View>
      
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
