import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';

export class UpdateTaskService {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(userId: string, taskId: string, updates: { title?: string; completed?: boolean }) {
    const task = await this.taskRepo.findByUserAndTaskId(userId, taskId);
    if (!task) throw new Error('Task not found');

    if (updates.title) task.updateTitle(updates.title);
    if (updates.completed !== undefined) {
      if (updates.completed) {
        task.complete();
      } else {
        task.uncomplete();
      }
    }

    await this.taskRepo.update(task);
    return task;
  }
}
