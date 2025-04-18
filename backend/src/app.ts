import express from 'express';
import cors from './shared/config/cors';
import userRoutes from './interfaces/routes/user/user.routes';
import taskRoutes from './interfaces/routes/task/task.routes';
import { authenticate } from './interfaces/middlewares/auth.middleware';

const app = express();

app.use(cors);
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticate, taskRoutes);

export default app;
