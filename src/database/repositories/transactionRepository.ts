import { getDatabase } from "../database";
import {
  TransactionWithCategory,
  TransactionType,
  CreateTransaction,
  UpdateTransaction,
} from "../../types/transaction";

export const transactionRepository = {
  async getAll(limit: number = 20, offset: number = 0): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       ORDER BY t.date DESC, t.id DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  },

  async getById(id: number): Promise<TransactionWithCategory | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.id = ?`,
      [id]
    );
  },

  async getByDateRange(from: string, to: string): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.date BETWEEN ? AND ? 
       ORDER BY t.date DESC`,
      [from, to]
    );
  },

  async getByType(type: TransactionType, limit: number = 20, offset: number = 0): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.type = ? 
       ORDER BY t.date DESC, t.id DESC 
       LIMIT ? OFFSET ?`,
      [type, limit, offset]
    );
  },

  async getByCategory(categoryId: number): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.category_id = ? 
       ORDER BY t.date DESC`,
      [categoryId]
    );
  },

  async getRecent(limit: number): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       ORDER BY t.date DESC, t.id DESC 
       LIMIT ?`,
      [limit]
    );
  },

  async sumByType(type: TransactionType, from: string, to: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM transactions WHERE type = ? AND date BETWEEN ? AND ?",
      [type, from, to]
    );
    return result?.total || 0;
  },

  async search(query: string, limit: number = 20, offset: number = 0): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.description LIKE ? 
       ORDER BY t.date DESC, t.id DESC 
       LIMIT ? OFFSET ?`,
      [`%${query}%`, limit, offset]
    );
  },

  async create(data: CreateTransaction): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      "INSERT INTO transactions (amount, type, category_id, description, date) VALUES (?, ?, ?, ?, ?)",
      [data.amount, data.type, data.category_id, data.description, data.date]
    );
    return result.lastInsertRowId;
  },

  async update(id: number, data: UpdateTransaction): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const params: any[] = [];

    if (data.amount !== undefined) {
      sets.push("amount = ?");
      params.push(data.amount);
    }
    if (data.type !== undefined) {
      sets.push("type = ?");
      params.push(data.type);
    }
    if (data.category_id !== undefined) {
      sets.push("category_id = ?");
      params.push(data.category_id);
    }
    if (data.description !== undefined) {
      sets.push("description = ?");
      params.push(data.description);
    }
    if (data.date !== undefined) {
      sets.push("date = ?");
      params.push(data.date);
    }

    if (sets.length === 0) return;

    params.push(id);
    await db.runAsync(`UPDATE transactions SET ${sets.join(", ")} WHERE id = ?`, params);
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM transactions WHERE id = ?", [id]);
  },

  async count(type?: TransactionType): Promise<number> {
    const db = await getDatabase();
    let query = "SELECT COUNT(*) as total FROM transactions";
    let params: any[] = [];

    if (type) {
      query += " WHERE type = ?";
      params.push(type);
    }

    const result = await db.getFirstAsync<{ total: number }>(query, params);
    return result?.total || 0;
  },
  async getMonthlySummary(): Promise<{ income: number; expense: number; balance: number }> {
    const db = await getDatabase();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}%`;

    const result = await db.getFirstAsync<{ income: number; expense: number }>(
      `SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
       FROM transactions 
       WHERE date LIKE ?`,
      [currentMonth]
    );

    const income = result?.income || 0;
    const expense = result?.expense || 0;
    return {
      income,
      expense,
      balance: income - expense,
    };
  },

  async getAllForExport(): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<TransactionWithCategory>(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       ORDER BY t.date DESC, t.id DESC`
    );
  },
};
