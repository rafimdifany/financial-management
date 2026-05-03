import { taskRepository } from '../database/repositories/taskRepository';
import { CreateTask, UpdateTask, TaskStatus } from '../types/task';

export const taskService = {
  async getTasks(status?: TaskStatus | 'all') {
    return await taskRepository.getAll(status);
  },

  async createTask(data: CreateTask) {
    if (!data.title.trim()) {
      throw new Error('Title is required');
    }
    return await taskRepository.create(data);
  },

  async updateTask(id: number, data: UpdateTask) {
    return await taskRepository.update(id, data);
  },

  async advanceStatus(id: number, currentStatus: TaskStatus) {
    const nextMap: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'done'
    };
    
    const nextStatus = nextMap[currentStatus];
    if (nextStatus !== currentStatus) {
      await taskRepository.updateStatus(id, nextStatus);
    }
    return nextStatus;
  },

  async deleteTask(id: number) {
    return await taskRepository.delete(id);
  },
};
