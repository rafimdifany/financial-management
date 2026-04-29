import { getDatabase } from "../database";
import { Category, CategoryType, CreateCategory, UpdateCategory } from "../../types/category";

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Category>("SELECT * FROM categories ORDER BY name ASC");
  },

  async getById(id: number): Promise<Category | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Category>("SELECT * FROM categories WHERE id = ?", [id]);
  },

  async getByType(type: CategoryType): Promise<Category[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Category>(
      "SELECT * FROM categories WHERE type = ? ORDER BY name ASC",
      [type]
    );
  },

  async getDefaults(): Promise<Category[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Category>("SELECT * FROM categories WHERE is_default = 1");
  },

  async create(data: CreateCategory): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      "INSERT INTO categories (name, icon, color, type, is_default) VALUES (?, ?, ?, ?, ?)",
      [data.name, data.icon, data.color, data.type, data.is_default]
    );
    return result.lastInsertRowId;
  },

  async update(id: number, data: UpdateCategory): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const params: any[] = [];

    if (data.name !== undefined) {
      sets.push("name = ?");
      params.push(data.name);
    }
    if (data.icon !== undefined) {
      sets.push("icon = ?");
      params.push(data.icon);
    }
    if (data.color !== undefined) {
      sets.push("color = ?");
      params.push(data.color);
    }
    if (data.type !== undefined) {
      sets.push("type = ?");
      params.push(data.type);
    }

    if (sets.length === 0) return;

    params.push(id);
    await db.runAsync(`UPDATE categories SET ${sets.join(", ")} WHERE id = ?`, params);
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    // Only delete if not default
    await db.runAsync("DELETE FROM categories WHERE id = ? AND is_default = 0", [id]);
  },
};
