export type BudgetPeriod = "weekly" | "monthly" | "yearly";

export interface Budget {
  id: number;
  category_id: number;
  amount: number;
  period: BudgetPeriod;
  created_at: string;
}

export interface BudgetWithSpent extends Budget {
  category_name: string;
  category_icon: string | null;
  category_color: string | null;
  spent: number;
}

export type CreateBudget = Omit<Budget, "id" | "created_at">;
