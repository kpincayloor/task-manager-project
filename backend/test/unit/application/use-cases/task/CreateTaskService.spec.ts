import { CreateTaskService } from '../../../../../src/application/use-cases/task/CreateTaskService';
import { Task } from '../../../../../src/domain/models/Task';
import { ITaskRepository } from '../../../../../src/domain/repositories/ITaskRepository';

describe('CreateTaskService', () => {
  const mockRepo: jest.Mocked<ITaskRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    deleteByUser: jest.fn(),
    findAllByUserId: jest.fn(),
    findByUserAndTaskId: jest.fn(),
  };

  it('should create a task with title and description', async () => {
    const service = new CreateTaskService(mockRepo);
    const result = await service.execute('user-id', 'Test Task', 'Test description');

    expect(mockRepo.create).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Task);
    expect(result.title).toBe('Test Task');
  });

  it('should create a task and call repository', async () => {
    const service = new CreateTaskService(mockRepo);
    const userId = 'user123';
    const title = 'Test title';
    const description = 'At the gym';

    const task = await service.execute(userId, title, description);

    expect(task).toBeInstanceOf(Task);
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          userId,
          title,
          description,
          completed: false,
        }),
      }),
    );
  });
});
