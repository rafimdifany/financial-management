export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  icon: string | null;
  color: string | null;
  deadline: string | null;
  created_at: string;
}

export type CreateGoal = Omit<Goal, "id" | "created_at" | "current_amount">;
export type UpdateGoal = Partial<Omit<Goal, "id" | "created_at">>;
