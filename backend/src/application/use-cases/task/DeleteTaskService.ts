import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';

export class DeleteTaskService {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(userId: string, taskId: string): Promise<void> {
    await this.taskRepo.deleteByUser(userId, taskId);
  }
}
