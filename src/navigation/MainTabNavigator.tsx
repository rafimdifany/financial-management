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
  const { colors, isDark, typography, radius } = useTheme();
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
          fontWeight: '500',
          marginTop: 6,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80 + insets.bottom,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: Platform.OS === "ios" ? "transparent" : (isDark ? colors.surfaceContainerLow : colors.surfaceContainerLowest),
          borderTopWidth: 0, // Enforce No-Line Rule §1.1
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          Platform.OS === "ios" ? (
            <BlurView
              intensity={isDark ? 40 : 60}
              tint={isDark ? "dark" : "light"}
              style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? `${colors.surfaceContainerLow}80` : `${colors.surfaceContainerLowest}A0` }]}
            />
          ) : null
        ),
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionStack}
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "receipt" : "receipt-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TasksTab"
        component={TaskStack}
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "calendar" : "calendar-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />
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
    width: 48,
    height: 32,
    borderRadius: 16,
  },
  indicator: {
    // Removed indicator in favor of tonal pill
  },
  tabBackground: {
    // Removed specific radius for a more integrated look
  },
});

