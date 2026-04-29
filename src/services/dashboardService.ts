import { transactionRepository } from "../database/repositories/transactionRepository";
import { budgetRepository } from "../database/repositories/budgetRepository";
import { goalRepository } from "../database/repositories/goalRepository";
import { taskRepository } from "../database/repositories/taskRepository";

export const dashboardService = {
  async getSummary() {
    return transactionRepository.getMonthlySummary();
  },

  async getBudgetProgress() {
    return budgetRepository.getBudgetWithSpent("monthly");
  },

  async getGoals() {
    return goalRepository.getAll();
  },

  async getRecentTransactions(limit = 5) {
    return transactionRepository.getRecent(limit);
  },

  async getPendingTasks(limit = 3) {
    const tasks = await taskRepository.getPending();
    return tasks.slice(0, limit);
  },
};
