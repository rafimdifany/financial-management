export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateTask = Omit<Task, "id" | "created_at" | "updated_at" | "status">;
export type UpdateTask = Partial<Omit<Task, "id" | "created_at">>;
