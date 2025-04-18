import { Request, Response } from 'express';
import {
  createUserService,
  findUserService,
} from '../../../shared/factories/user/user-service.factory';
import * as admin from 'firebase-admin';

export class UserController {
  constructor() {
    this.findByEmail = this.findByEmail.bind(this);
    this.create = this.create.bind(this);
  }

  async findByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;

      if (typeof email !== 'string') {
        res.status(400).json({ message: 'Invalid email' });
        return;
      }

      const user = await findUserService.execute(email);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const token = await admin.auth().createCustomToken(user.id);

      res.status(200).json({ token, user: user.toPrimitives() });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Internal server error';

      res.status(500).json({
        message,
      });
    }
  }

  async create(req: Request, res: Response) {
    const { email } = req.body;
    const user = await createUserService.execute(email);
    res.status(201).json(user.toPrimitives());
  }
}
