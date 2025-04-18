import RepositoryFactory from '../repository.factory';
import { CreateTaskService } from '../../../application/use-cases/task/CreateTaskService';
import { UpdateTaskService } from '../../../application/use-cases/task/UpdateTaskService';
import { DeleteTaskService } from '../../../application/use-cases/task/DeleteTaskService';
import { ListTasksService } from '../../../application/use-cases/task/ListTasksService';

export const createTaskService = new CreateTaskService(RepositoryFactory.getTaskRepository());
export const updateTaskService = new UpdateTaskService(RepositoryFactory.getTaskRepository());
export const deleteTaskService = new DeleteTaskService(RepositoryFactory.getTaskRepository());
export const listTasksService = new ListTasksService(RepositoryFactory.getTaskRepository());
