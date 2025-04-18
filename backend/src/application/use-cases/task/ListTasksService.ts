import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/models/Task';

export class ListTasksService {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    return this.taskRepo.findAllByUserId(userId);
  }
}
