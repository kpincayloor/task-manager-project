import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class FindUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string) {
    return this.userRepo.findByEmail(email);
  }
}
