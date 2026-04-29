import { getDatabase } from "../database";
import { Budget, BudgetPeriod, BudgetWithSpent, CreateBudget } from "../../types/budget";

export const budgetRepository = {
  async getAll(): Promise<Budget[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Budget>("SELECT * FROM budgets");
  },

  async getByCategory(categoryId: number): Promise<Budget | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Budget>("SELECT * FROM budgets WHERE category_id = ?", [
      categoryId,
    ]);
  },

  async getBudgetWithSpent(period: BudgetPeriod = "monthly"): Promise<BudgetWithSpent[]> {
    const db = await getDatabase();
    // For simplicity, we'll assume "monthly" means transactions in the current month (YYYY-MM)
    const currentMonth = new Date().toISOString().substring(0, 7); // '2026-04'

    return await db.getAllAsync<BudgetWithSpent>(
      `SELECT 
        b.*, 
        c.name as category_name, 
        c.icon as category_icon, 
        c.color as category_color,
        COALESCE((
          SELECT SUM(amount) 
          FROM transactions 
          WHERE category_id = b.category_id 
          AND date LIKE ? 
          AND type = 'expense'
        ), 0) as spent
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.period = ?`,
      [`${currentMonth}%`, period]
    );
  },

  async create(data: CreateBudget): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      "INSERT INTO budgets (category_id, amount, period) VALUES (?, ?, ?)",
      [data.category_id, data.amount, data.period]
    );
    return result.lastInsertRowId;
  },

  async update(id: number, data: Partial<CreateBudget>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const params: any[] = [];

    if (data.category_id !== undefined) {
      sets.push("category_id = ?");
      params.push(data.category_id);
    }
    if (data.amount !== undefined) {
      sets.push("amount = ?");
      params.push(data.amount);
    }
    if (data.period !== undefined) {
      sets.push("period = ?");
      params.push(data.period);
    }

    if (sets.length === 0) return;

    params.push(id);
    await db.runAsync(`UPDATE budgets SET ${sets.join(", ")} WHERE id = ?`, params);
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM budgets WHERE id = ?", [id]);
  },
};
