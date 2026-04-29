import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransactionListScreen } from "../screens/transaction/TransactionListScreen";
import { TransactionFormScreen } from "../screens/transaction/TransactionFormScreen";
import { TransactionStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<TransactionStackParamList>();

export const TransactionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionList" component={TransactionListScreen} />
      <Stack.Screen 
        name="TransactionForm" 
        component={TransactionFormScreen} 
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};
