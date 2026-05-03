import { create } from 'zustand';
import { Budget, BudgetPeriod, CreateBudget } from '../types/budget';
import { budgetRepository } from '../database/repositories/budgetRepository';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  
  fetchBudgets: () => Promise<void>;
  setBudget: (categoryId: number, amount: number, period: BudgetPeriod) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,

  fetchBudgets: async () => {
    set({ isLoading: true });
    try {
      const data = await budgetRepository.getAll();
      set({ budgets: data });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setBudget: async (categoryId, amount, period) => {
    set({ isLoading: true });
    try {
      const existing = await budgetRepository.getByCategory(categoryId);
      if (existing) {
        if (amount === 0) {
          await budgetRepository.delete(existing.id);
        } else {
          await budgetRepository.update(existing.id, { amount, period });
        }
      } else if (amount > 0) {
        await budgetRepository.create({ category_id: categoryId, amount, period });
      }
      await get().fetchBudgets();
    } catch (error) {
      console.error('Error setting budget:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true });
    try {
      await budgetRepository.delete(id);
      await get().fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
