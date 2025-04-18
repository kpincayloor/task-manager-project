import { Request, Response } from 'express';
import {
  createTaskService,
  deleteTaskService,
  listTasksService,
  updateTaskService,
} from '../../../shared/factories/task/task-service.factory';
import { getAuthenticatedUserId } from '../../../shared/helpers/get-authenticated-user-id';

export class TaskController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const tasks = await listTasksService.execute(userId);
    res.json(tasks.map(t => t.toPrimitives()));
  }

  async create(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const { title, description } = req.body;
    const task = await createTaskService.execute(userId, title, description);
    res.status(201).json(task.toPrimitives());
  }

  async update(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const { taskId } = req.params;
    const { title, completed } = req.body;
    const task = await updateTaskService.execute(userId, taskId, { title, completed });
    res.json(task.toPrimitives());
  }

  async delete(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const { taskId } = req.params;
    await deleteTaskService.execute(userId, taskId);
    res.status(204).send();
  }
}
