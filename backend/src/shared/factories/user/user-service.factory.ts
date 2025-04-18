import RepositoryFactory from '../repository.factory';
import { CreateUserService } from '../../../application/use-cases/user/CreateUserService';
import { FindUserService } from '../../../application/use-cases/user/FindUserService';

export const createUserService = new CreateUserService(RepositoryFactory.getUserRepository());
export const findUserService = new FindUserService(RepositoryFactory.getUserRepository());
