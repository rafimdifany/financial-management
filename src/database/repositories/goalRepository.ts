import { getDatabase } from "../database";
import { Goal, CreateGoal, UpdateGoal } from "../../types/goal";

export const goalRepository = {
  async getAll(): Promise<Goal[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Goal>("SELECT * FROM goals ORDER BY created_at DESC");
  },

  async create(data: CreateGoal): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      "INSERT INTO goals (name, target_amount, current_amount, icon, color, deadline) VALUES (?, ?, 0, ?, ?, ?)",
      [data.name, data.target_amount, data.icon, data.color, data.deadline]
    );
    return result.lastInsertRowId;
  },

  async update(id: number, data: UpdateGoal): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const params: any[] = [];

    if (data.name !== undefined) {
      sets.push("name = ?");
      params.push(data.name);
    }
    if (data.target_amount !== undefined) {
      sets.push("target_amount = ?");
      params.push(data.target_amount);
    }
    if (data.current_amount !== undefined) {
      sets.push("current_amount = ?");
      params.push(data.current_amount);
    }
    if (data.icon !== undefined) {
      sets.push("icon = ?");
      params.push(data.icon);
    }
    if (data.color !== undefined) {
      sets.push("color = ?");
      params.push(data.color);
    }
    if (data.deadline !== undefined) {
      sets.push("deadline = ?");
      params.push(data.deadline);
    }

    if (sets.length === 0) return;

    params.push(id);
    await db.runAsync(`UPDATE goals SET ${sets.join(", ")} WHERE id = ?`, params);
  },

  async updateAmount(id: number, amount: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("UPDATE goals SET current_amount = ? WHERE id = ?", [amount, id]);
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM goals WHERE id = ?", [id]);
  },
};
