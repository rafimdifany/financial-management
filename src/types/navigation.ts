import { Transaction } from "./transaction";
import { Task } from "./task";

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
};

export type TransactionStackParamList = {
  TransactionList: undefined;
  TransactionForm: { transaction?: Transaction; mode: "create" | "edit" };
};

export type TaskStackParamList = {
  TaskList: undefined;
  TaskForm: { task?: Task; mode: "create" | "edit" };
};

export type SettingsStackParamList = {
  Settings: undefined;
  CategoryManage: { type?: "income" | "expense" };
  BudgetManage: undefined;
  GoalManage: undefined;
  DataManage: undefined;
};
