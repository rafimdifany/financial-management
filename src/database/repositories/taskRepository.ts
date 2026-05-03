import { getDatabase } from "../database";
import { Task, TaskStatus, CreateTask, UpdateTask } from "../../types/task";

export const taskRepository = {
  async getAll(status?: TaskStatus | 'all'): Promise<Task[]> {
    const db = await getDatabase();
    let query = "SELECT * FROM tasks";
    const params: any[] = [];

    if (status && status !== 'all') {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";
    return await db.getAllAsync<Task>(query, params);
  },

  async getById(id: number): Promise<Task | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Task>("SELECT * FROM tasks WHERE id = ?", [id]);
  },

  async create(data: CreateTask): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      "INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)",
      [
        data.title, 
        data.description || null, 
        data.status || 'todo', 
        data.priority || 'medium', 
        data.due_date || null
      ]
    );
    return result.lastInsertRowId;
  },

  async update(id: number, data: UpdateTask): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
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

    if (sets.length === 0) return;

    sets.push("updated_at = datetime('now')");
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
