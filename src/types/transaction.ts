export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  category_id: number | null;
  description: string | null;
  date: string; // ISO 8601
  created_at: string;
}

// Include category info for display
export interface TransactionWithCategory extends Transaction {
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
}

export type CreateTransaction = Omit<Transaction, "id" | "created_at">;
export type UpdateTransaction = Partial<CreateTransaction>;
