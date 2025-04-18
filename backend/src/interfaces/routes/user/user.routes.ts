import { Router } from 'express';
import { UserController } from '../../controllers/user/user.controller';

const router = Router();
const controller = new UserController();

router.get('/', controller.findByEmail);
router.post('/', controller.create);

export default router;
