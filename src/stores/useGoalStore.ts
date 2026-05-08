import { create } from 'zustand';
import { Goal, CreateGoal, UpdateGoal } from '../types/goal';
import { goalRepository } from '../database/repositories/goalRepository';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  
  fetchGoals: () => Promise<void>;
  addGoal: (data: CreateGoal) => Promise<void>;
  updateGoal: (id: number, data: UpdateGoal) => Promise<void>;
  updateAmount: (id: number, amount: number) => Promise<void>;
  deleteGoal: (id: number) => Promise<void>;
  reset: () => void;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const data = await goalRepository.getAll();
      set({ goals: data });
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (data) => {
    set({ isLoading: true });
    try {
      await goalRepository.create(data);
      await get().fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: async (id, data) => {
    set({ isLoading: true });
    try {
      await goalRepository.update(id, data);
      await get().fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAmount: async (id, amount) => {
    try {
      await goalRepository.updateAmount(id, amount);
      await get().fetchGoals();
    } catch (error) {
      console.error('Error updating goal amount:', error);
      throw error;
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true });
    try {
      await goalRepository.delete(id);
      await get().fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      goals: [],
      isLoading: false,
    });
  },
}));
