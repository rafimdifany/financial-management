import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "../screens/SplashScreen";
import { MainTabNavigator } from "./MainTabNavigator";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
};
