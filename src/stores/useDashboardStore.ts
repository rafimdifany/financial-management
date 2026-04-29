import { create } from "zustand";
import { dashboardService } from "../services/dashboardService";
import { TransactionWithCategory } from "../types/transaction";
import { Task } from "../types/task";
import { BudgetWithSpent } from "../types/budget";
import { Goal } from "../types/goal";

interface DashboardState {
  balance: number;
  income: number;
  expense: number;
  budgetProgress: BudgetWithSpent[];
  goals: Goal[];
  recentTransactions: TransactionWithCategory[];
  pendingTasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  refreshSummary: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  balance: 0,
  income: 0,
  expense: 0,
  budgetProgress: [],
  goals: [],
  recentTransactions: [],
  pendingTasks: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summary, budgets, goals, transactions, tasks] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getBudgetProgress(),
        dashboardService.getGoals(),
        dashboardService.getRecentTransactions(),
        dashboardService.getPendingTasks(),
      ]);

      set({
        balance: summary.balance,
        income: summary.income,
        expense: summary.expense,
        budgetProgress: budgets,
        goals: goals,
        recentTransactions: transactions,
        pendingTasks: tasks,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch dashboard data" 
      });
    }
  },

  refreshSummary: async () => {
    try {
      const summary = await dashboardService.getSummary();
      set({
        balance: summary.balance,
        income: summary.income,
        expense: summary.expense,
      });
    } catch (error) {
      console.error("Failed to refresh summary:", error);
    }
  },
}));
