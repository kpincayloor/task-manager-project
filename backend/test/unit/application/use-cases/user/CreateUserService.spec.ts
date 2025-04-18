import { CreateUserService } from '../../../../../src/application/use-cases/user/CreateUserService';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { User } from '../../../../../src/domain/models/User';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('firebase-admin', () => ({
  auth: () => ({
    createUser: jest.fn().mockResolvedValue({ uid: 'firebase-uid-123' }),
  }),
}));

describe('CreateUserService', () => {
  const mockUserRepo: IUserRepository = {
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
  };

  const service = new CreateUserService(mockUserRepo);

  it('should create a new user if not found', async () => {
    const email = 'kevin@example.com';

    const user = await service.execute(email);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
    expect(mockUserRepo.create).toHaveBeenCalled();
    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe(email);
  });

  it('should return existing user if already exists', async () => {
    const existingUser = new User({
      id: 'user-123',
      email: 'kevin@example.com',
      createdAt: new Date(),
    });

    mockUserRepo.findByEmail = jest.fn().mockResolvedValue(existingUser);

    const user = await service.execute('kevin@example.com');

    expect(user).toBe(existingUser);
    expect(mockUserRepo.create).not.toHaveBeenCalled();
  });
});
