import { ListTasksService } from '../../../../../src/application/use-cases/task/ListTasksService';
import { Task } from '../../../../../src/domain/models/Task';
import { ITaskRepository } from '../../../../../src/domain/repositories/ITaskRepository';

describe('ListTasksService', () => {
  const mockTasks = [
    new Task({
      id: 't1',
      userId: '123456789',
      title: 'Test Task',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  const mockTaskRepo: ITaskRepository = {
    findAllByUserId: jest.fn().mockResolvedValue(mockTasks),
    findByUserAndTaskId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteByUser: jest.fn(),
  };

  const service = new ListTasksService(mockTaskRepo);

  it('should return tasks from repository', async () => {
    const tasks = await service.execute('user123');

    expect(mockTaskRepo.findAllByUserId).toHaveBeenCalledWith('user123');
    expect(tasks).toEqual(mockTasks);
  });
});
