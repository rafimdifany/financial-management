import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";

const Stack = createNativeStackNavigator();

export const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    </Stack.Navigator>
  );
};
