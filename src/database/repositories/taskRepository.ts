import { getDatabase } from "../database";
import { Task, TaskStatus, CreateTask, UpdateTask } from "../../types/task";

export const taskRepository = {
  async getAll(): Promise<Task[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Task>("SELECT * FROM tasks ORDER BY created_at DESC");
  },

  async getByStatus(status: TaskStatus): Promise<Task[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Task>(
      "SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC",
      [status]
    );
  },

  async getPending(): Promise<Task[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Task>(
      "SELECT * FROM tasks WHERE status IN ('todo', 'in_progress') ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END, due_date IS NULL, due_date ASC"
    );
  },

  async create(data: CreateTask): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      "INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)",
      [data.title, data.description, data.priority, data.due_date]
    );
    return result.lastInsertRowId;
  },

  async update(id: number, data: UpdateTask): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = ["updated_at = datetime('now')"];
    const params: any[] = [];

    if (data.title !== undefined) {
      sets.push("title = ?");
      params.push(data.title);
    }
    if (data.description !== undefined) {
      sets.push("description = ?");
      params.push(data.description);
    }
    if (data.status !== undefined) {
      sets.push("status = ?");
      params.push(data.status);
    }
    if (data.priority !== undefined) {
      sets.push("priority = ?");
      params.push(data.priority);
    }
    if (data.due_date !== undefined) {
      sets.push("due_date = ?");
      params.push(data.due_date);
    }

    params.push(id);
    await db.runAsync(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`, params);
  },

  async updateStatus(id: number, status: TaskStatus): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE tasks SET status = ?, updated_at = datetime('now') WHERE id = ?",
      [status, id]
    );
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
  },
};
