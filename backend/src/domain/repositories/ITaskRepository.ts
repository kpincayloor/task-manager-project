import { Task } from '../models/Task';

export interface ITaskRepository {
  findAllByUserId(userId: string): Promise<Task[]>;
  findByUserAndTaskId(userId: string, taskId: string): Promise<Task | null>;
  create(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  deleteByUser(userId: string, taskId: string): Promise<void>;
}
