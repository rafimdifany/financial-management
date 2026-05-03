import { create } from 'zustand';
import { TransactionWithCategory, CreateTransaction, UpdateTransaction } from '../types/transaction';
import { transactionService } from '../services/transactionService';

interface TransactionState {
  transactions: TransactionWithCategory[];
  isLoading: boolean;
  isRefreshing: boolean;
  filter: 'all' | 'income' | 'expense';
  searchQuery: string;
  page: number;
  hasMore: boolean;
  
  // Actions
  fetchTransactions: (refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  setFilter: (filter: 'all' | 'income' | 'expense') => void;
  setSearchQuery: (query: string) => void;
  
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
  page: 1,
  hasMore: true,

  fetchTransactions: async (refresh = false) => {
    const { filter, searchQuery } = get();
    
    if (refresh) {
      set({ isRefreshing: true });
    } else {
      set({ isLoading: true });
    }

    try {
      let data: TransactionWithCategory[] = [];
      
      if (searchQuery.trim()) {
        data = await transactionService.searchTransactions(searchQuery);
        set({ transactions: data, page: 1, hasMore: false });
      } else {
        data = await transactionService.getTransactions(filter, 1, PAGE_SIZE);
        set({ 
          transactions: data, 
          page: 1, 
          hasMore: data.length === PAGE_SIZE 
        });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      set({ isLoading: false, isRefreshing: false });
    }
  },

  loadMore: async () => {
    const { filter, page, hasMore, isLoading, transactions, searchQuery } = get();
    
    if (isLoading || !hasMore || searchQuery.trim()) return;

    set({ isLoading: true });
    try {
      const nextPage = page + 1;
      const newData = await transactionService.getTransactions(filter, nextPage, PAGE_SIZE);
      
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
    set({ searchQuery, page: 1, hasMore: !searchQuery.trim() });
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
      page: 1,
      hasMore: true,
    });
  },
}));
