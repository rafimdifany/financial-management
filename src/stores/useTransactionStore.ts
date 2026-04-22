import { create } from 'zustand';
import { Transaction, CreateTransaction } from '../types/transaction';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  filter: 'all' | 'income' | 'expense';
  
  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (tx: CreateTransaction) => Promise<void>;
  setFilter: (filter: 'all' | 'income' | 'expense') => void;
  setLoading: (loading: boolean) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  filter: 'all',

  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
  setFilter: (filter) => set({ filter }),
  
  addTransaction: async (tx) => {
    // Logic will be implemented in future phases with database integration
    console.log('Adding transaction:', tx);
  },
}));
