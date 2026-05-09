import { transactionRepository } from '../database/repositories/transactionRepository';
import { CreateTransaction, UpdateTransaction, TransactionType } from '../types/transaction';

export const transactionService = {
  async getTransactions(filter: 'all' | 'income' | 'expense', page: number, pageSize = 20, month?: string) {
    const offset = (page - 1) * pageSize;
    
    if (filter === 'all') {
      return await transactionRepository.getAll(pageSize, offset, month);
    } else {
      return await transactionRepository.getByType(filter as TransactionType, pageSize, offset, month);
    }
  },

  async searchTransactions(query: string, page: number = 1, pageSize = 20) {
    if (!query.trim()) return [];
    const offset = (page - 1) * pageSize;
    return await transactionRepository.search(query, pageSize, offset);
  },

  async createTransaction(data: CreateTransaction) {
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    return await transactionRepository.create(data);
  },

  async updateTransaction(id: number, data: UpdateTransaction) {
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    return await transactionRepository.update(id, data);
  },

  async deleteTransaction(id: number) {
    return await transactionRepository.delete(id);
  },

  async getTransactionCount(type?: 'all' | 'income' | 'expense') {
    const repoType = type === 'all' ? undefined : (type as TransactionType);
    return await transactionRepository.count(repoType);
  },

  async getMonthlySummary(month?: string) {
    return await transactionRepository.getMonthlySummary(month);
  }
};
