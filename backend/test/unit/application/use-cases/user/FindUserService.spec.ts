import { FindUserService } from '../../../../../src/application/use-cases/user/FindUserService';
import { User } from '../../../../../src/domain/models/User';

describe('FindUserService', () => {
  const mockUser = new User({
    id: 'user123',
    email: 'kevin@example.com',
    createdAt: new Date(),
  });

  const mockUserRepo = {
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn(),
  };

  const service = new FindUserService(mockUserRepo);

  it('should return user from repository by email', async () => {
    const result = await service.execute('kevin@example.com');

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('kevin@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce(null);

    const result = await service.execute('notfound@example.com');
    expect(result).toBeNull();
  });
});
