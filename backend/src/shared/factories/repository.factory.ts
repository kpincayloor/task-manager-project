import { FirestoreTaskRepository } from '../../infrastructure/firestore/FirestoreTaskRepository';
import { FirestoreUserRepository } from '../../infrastructure/firestore/FirestoreUserRepository';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

class RepositoryFactory {
  private static taskRepo: ITaskRepository;
  private static userRepo: IUserRepository;

  static getTaskRepository(): ITaskRepository {
    if (!this.taskRepo) {
      this.taskRepo = new FirestoreTaskRepository();
    }
    return this.taskRepo;
  }

  static getUserRepository(): IUserRepository {
    if (!this.userRepo) {
      this.userRepo = new FirestoreUserRepository();
    }
    return this.userRepo;
  }
}

export default RepositoryFactory;
