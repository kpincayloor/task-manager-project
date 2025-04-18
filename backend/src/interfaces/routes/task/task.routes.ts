import { Router } from 'express';
import { TaskController } from '../../controllers/task/task.controller';

const router = Router();
const controller = new TaskController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:taskId', controller.update);
router.delete('/:taskId', controller.delete);

export default router;
