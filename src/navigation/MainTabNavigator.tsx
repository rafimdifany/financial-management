import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { DashboardStack } from "./DashboardStack";
import { TransactionStack } from "./TransactionStack";
import { TaskStack } from "./TaskStack";
import { SettingsStack } from "./SettingsStack";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: focused ? `${colors.primary}18` : "transparent" },
      ]}
    >
      <Ionicons name={name as any} size={22} color={color} />
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: focused ? colors.primary : "transparent",
          }
        ]}
      />
    </View>
  );
};

export const MainTabNavigator = () => {
  const { colors, isDark, typography } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: {
          ...typography.labelSm,
          textTransform: "uppercase",
          marginTop: 4,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80 + insets.bottom,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: Platform.OS === "ios" ? "transparent" : (isDark ? `${colors.surfaceContainerLow}F2` : `${colors.surface}CC`),
          borderTopWidth: 0, // Enforce No-Line Rule §1.1
          elevation: isDark ? 10 : 0,
          shadowColor: isDark ? "#000" : "transparent",
        },
        tabBarBackground: () => (
          Platform.OS === "ios" ? (
            <BlurView
              intensity={isDark ? 70 : 80}
              tint={isDark ? "dark" : "light"}
              style={[StyleSheet.absoluteFill, styles.tabBackground]}
            />
          ) : null
        ),
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          title: "HOME",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "grid" : "grid-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionStack}
        options={{
          title: "WALLET",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "swap-horizontal" : "swap-horizontal-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TasksTab"
        component={TaskStack}
        options={{
          title: "TASKS",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "checkbox" : "checkbox-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "settings" : "settings-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 26,
    borderRadius: 999,
  },
  indicator: {
    position: "absolute",
    bottom: -22,
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  tabBackground: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
});
