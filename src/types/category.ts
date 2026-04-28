export type CategoryType = "income" | "expense";

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  type: CategoryType;
  is_default: number; // 0 | 1
  created_at: string;
}

export type CreateCategory = Omit<Category, "id" | "created_at">;
export type UpdateCategory = Partial<CreateCategory>;
