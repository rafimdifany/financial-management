import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Text } from "../components/common/Text";

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text variant="headlineMd">{name}</Text>
  </View>
);

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Dashboard" 
        component={() => <PlaceholderScreen name="Dashboard" />} 
      />
      <Tab.Screen 
        name="Transactions" 
        component={() => <PlaceholderScreen name="Transactions" />} 
      />
      <Tab.Screen 
        name="Tasks" 
        component={() => <PlaceholderScreen name="Tasks" />} 
      />
      <Tab.Screen 
        name="Settings" 
        component={() => <PlaceholderScreen name="Settings" />} 
      />
    </Tab.Navigator>
  );
};
