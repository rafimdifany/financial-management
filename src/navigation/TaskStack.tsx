import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TaskListScreen } from "../screens/task/TaskListScreen";
import { TaskFormScreen } from "../screens/task/TaskFormScreen";
import { TaskStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<TaskStackParamList>();

export const TaskStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen 
        name="TaskForm" 
        component={TaskFormScreen} 
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};
