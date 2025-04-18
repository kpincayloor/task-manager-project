import { DeleteTaskService } from '../../../../../src/application/use-cases/task/DeleteTaskService';
import { ITaskRepository } from '../../../../../src/domain/repositories/ITaskRepository';

describe('DeleteTaskService', () => {
  const mockTaskRepo: ITaskRepository = {
    findAllByUserId: jest.fn(),
    findByUserAndTaskId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteByUser: jest.fn(),
  };

  const service = new DeleteTaskService(mockTaskRepo);

  it('should call repository.delete with correct userId and taskId', async () => {
    await service.execute('user123', 'task456');

    expect(mockTaskRepo.deleteByUser).toHaveBeenCalledWith('user123', 'task456');
  });
});
