import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { CategoryManageScreen } from "../screens/settings/CategoryManageScreen";
import { BudgetManageScreen } from "../screens/settings/BudgetManageScreen";
import { GoalManageScreen } from "../screens/settings/GoalManageScreen";
import { DataManageScreen } from "../screens/settings/DataManageScreen";
import { SettingsStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CategoryManage" component={CategoryManageScreen} />
      <Stack.Screen name="BudgetManage" component={BudgetManageScreen} />
      <Stack.Screen name="GoalManage" component={GoalManageScreen} />
      <Stack.Screen name="DataManage" component={DataManageScreen} />
    </Stack.Navigator>
  );
};
