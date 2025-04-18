import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/models/Task';
import { v4 as uuidv4 } from 'uuid';

export class CreateTaskService {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(userId: string, title: string, description?: string): Promise<Task> {
    const task = new Task({
      id: uuidv4(),
      userId,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.taskRepo.create(task);

    return task;
  }
}
