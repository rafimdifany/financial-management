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
  const { colors, spacing } = useTheme();
  
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={name as any} size={24} color={color} />
      {focused && (
        <View 
          style={[
            styles.indicator, 
            { backgroundColor: colors.primary, marginTop: spacing.xs }
          ]} 
        />
      )}
    </View>
  );
};

export const MainTabNavigator = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64 + insets.bottom,
          backgroundColor: Platform.OS === "ios" ? "transparent" : `${colors.surface}E6`,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null
        ),
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "grid" : "grid-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "swap-horizontal" : "swap-horizontal-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TasksTab"
        component={TaskStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "checkbox" : "checkbox-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
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
    paddingTop: 10,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    // marginTop moved to inline style using spacing token
  },
});
