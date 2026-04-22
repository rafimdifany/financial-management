export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  is_default: boolean;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  category_id: number;
  description: string;
  date: string; // ISO 8601
  created_at: string;
}

export interface CreateTransaction {
  amount: number;
  type: TransactionType;
  category_id: number;
  description: string;
  date: string;
}
