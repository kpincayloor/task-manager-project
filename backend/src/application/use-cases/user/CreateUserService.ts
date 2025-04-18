import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/models/User';
import * as admin from 'firebase-admin';

export class CreateUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) return existing;

    const firebaseUser = await admin.auth().createUser({ email });
    const user = new User({
      id: firebaseUser.uid,
      email,
      createdAt: new Date(),
    });

    await this.userRepo.create(user);

    return user;
  }
}
