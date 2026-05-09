import { create } from 'zustand';
import { TransactionWithCategory, CreateTransaction, UpdateTransaction } from '../types/transaction';
import { transactionService } from '../services/transactionService';
import { format } from 'date-fns';

interface TransactionState {
  transactions: TransactionWithCategory[];
  isLoading: boolean;
  isRefreshing: boolean;
  filter: 'all' | 'income' | 'expense';
  searchQuery: string;
  selectedMonth: string; // YYYY-MM
  page: number;
  hasMore: boolean;
  summary: { income: number; expense: number; balance: number };
  
  // Actions
  fetchTransactions: (refresh?: boolean) => Promise<void>;
  fetchSummary: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilter: (filter: 'all' | 'income' | 'expense') => void;
  setSearchQuery: (query: string) => void;
  setSelectedMonth: (month: string) => void;
  
  // CRUD Actions
  addTransaction: (tx: CreateTransaction) => Promise<void>;
  updateTransaction: (id: number, tx: UpdateTransaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  reset: () => void;
}

const PAGE_SIZE = 20;

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  isRefreshing: false,
  filter: 'all',
  searchQuery: '',
  selectedMonth: format(new Date(), 'yyyy-MM'),
  page: 1,
  hasMore: true,
  summary: { income: 0, expense: 0, balance: 0 },

  fetchTransactions: async (refresh = false) => {
    const { filter, searchQuery, selectedMonth } = get();
    
    if (refresh) {
      set({ isRefreshing: true });
    } else {
      set({ isLoading: true });
    }

    try {
      let data: TransactionWithCategory[] = [];
      
      if (searchQuery.trim()) {
        data = await transactionService.searchTransactions(searchQuery, 1, PAGE_SIZE);
        set({ 
          transactions: data, 
          page: 1, 
          hasMore: data.length === PAGE_SIZE 
        });
      } else {
        data = await transactionService.getTransactions(filter, 1, PAGE_SIZE, selectedMonth);
        set({ 
          transactions: data, 
          page: 1, 
          hasMore: data.length === PAGE_SIZE 
        });
      }
      
      // Also fetch summary when fetching transactions
      await get().fetchSummary();
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      set({ isLoading: false, isRefreshing: false });
    }
  },

  fetchSummary: async () => {
    try {
      const { selectedMonth } = get();
      const summary = await transactionService.getMonthlySummary(selectedMonth);
      set({ summary });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  },

  loadMore: async () => {
    const { filter, page, hasMore, isLoading, transactions, searchQuery, selectedMonth } = get();
    
    if (isLoading || !hasMore) return;

    set({ isLoading: true });
    try {
      const nextPage = page + 1;
      let newData: TransactionWithCategory[] = [];
      
      if (searchQuery.trim()) {
        newData = await transactionService.searchTransactions(searchQuery, nextPage, PAGE_SIZE);
      } else {
        newData = await transactionService.getTransactions(filter, nextPage, PAGE_SIZE, selectedMonth);
      }
      
      set({
        transactions: [...transactions, ...newData],
        page: nextPage,
        hasMore: newData.length === PAGE_SIZE
      });
    } catch (error) {
      console.error('Error loading more transactions:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setFilter: (filter) => {
    set({ filter, searchQuery: '', page: 1, hasMore: true });
    get().fetchTransactions();
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery, page: 1 });
    get().fetchTransactions();
  },

  setSelectedMonth: (selectedMonth) => {
    set({ selectedMonth, page: 1, hasMore: true });
    get().fetchTransactions();
  },

  addTransaction: async (tx) => {
    set({ isLoading: true });
    try {
      await transactionService.createTransaction(tx);
      await get().fetchTransactions(true);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (id, tx) => {
    set({ isLoading: true });
    try {
      await transactionService.updateTransaction(id, tx);
      await get().fetchTransactions(true);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true });
    try {
      await transactionService.deleteTransaction(id);
      await get().fetchTransactions(true);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      transactions: [],
      isLoading: false,
      isRefreshing: false,
      filter: 'all',
      searchQuery: '',
      selectedMonth: format(new Date(), 'yyyy-MM'),
      page: 1,
      hasMore: true,
      summary: { income: 0, expense: 0, balance: 0 },
    });
  },
}));

