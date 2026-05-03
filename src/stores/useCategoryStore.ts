import { create } from 'zustand';
import { Category, CreateCategory, UpdateCategory } from '../types/category';
import { categoryRepository } from '../database/repositories/categoryRepository';

interface CategoryState {
  categories: Category[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  isLoading: boolean;
  
  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (category: CreateCategory) => Promise<void>;
  updateCategory: (id: number, category: UpdateCategory) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  expenseCategories: [],
  incomeCategories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const data = await categoryRepository.getAll();
      set({ 
        categories: data,
        expenseCategories: data.filter(c => c.type === 'expense'),
        incomeCategories: data.filter(c => c.type === 'income')
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true });
    try {
      await categoryRepository.create(category);
      await get().fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, category) => {
    set({ isLoading: true });
    try {
      await categoryRepository.update(id, category);
      await get().fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      await categoryRepository.delete(id);
      await get().fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
