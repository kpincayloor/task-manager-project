import { UpdateTaskService } from '../../../../../src/application/use-cases/task/UpdateTaskService';
import { Task } from '../../../../../src/domain/models/Task';
import { ITaskRepository } from '../../../../../src/domain/repositories/ITaskRepository';

describe('UpdateTaskService', () => {
  const task = new Task({
    id: 't1',
    userId: '123456789',
    title: 'Old Title',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockTaskRepo: ITaskRepository = {
    findAllByUserId: jest.fn(),
    findByUserAndTaskId: jest.fn().mockResolvedValue(task),
    create: jest.fn(),
    update: jest.fn(),
    deleteByUser: jest.fn(),
  };

  const service = new UpdateTaskService(mockTaskRepo);

  it('should update task title and completed status', async () => {
    const result = await service.execute('user123', 'task1', {
      title: 'Updated Title',
      completed: true,
    });

    expect(mockTaskRepo.findByUserAndTaskId).toHaveBeenCalledWith('user123', 'task1');
    expect(mockTaskRepo.update).toHaveBeenCalledWith(task);
    expect(result.title).toBe('Updated Title');
    expect(result.completed).toBe(true);
  });

  it('should throw if task is not found', async () => {
    mockTaskRepo.findByUserAndTaskId = jest.fn().mockResolvedValueOnce(null);

    await expect(service.execute('user123', 'not-found', { title: 'New Title' })).rejects.toThrow(
      'Task not found',
    );
  });
});
