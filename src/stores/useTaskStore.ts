import { create } from 'zustand';
import { Task, TaskStatus, CreateTask, UpdateTask } from '../types/task';
import { taskService } from '../services/taskService';

interface TaskState {
  tasks: Task[];
  statusFilter: TaskStatus | 'all';
  isLoading: boolean;
  
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (data: CreateTask) => Promise<void>;
  updateTask: (id: number, data: UpdateTask) => Promise<void>;
  advanceStatus: (id: number, current: TaskStatus) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setStatusFilter: (filter: TaskStatus | 'all') => void;
  reset: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  statusFilter: 'all',
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const { statusFilter } = get();
      const tasks = await taskService.getTasks(statusFilter);
      set({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (data: CreateTask) => {
    set({ isLoading: true });
    try {
      await taskService.createTask(data);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id: number, data: UpdateTask) => {
    set({ isLoading: true });
    try {
      await taskService.updateTask(id, data);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  advanceStatus: async (id: number, current: TaskStatus) => {
    try {
      await taskService.advanceStatus(id, current);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error advancing task status:', error);
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    set({ isLoading: true });
    try {
      await taskService.deleteTask(id);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter });
    get().fetchTasks();
  },

  reset: () => {
    set({
      tasks: [],
      statusFilter: 'all',
      isLoading: false,
    });
  },
}));
