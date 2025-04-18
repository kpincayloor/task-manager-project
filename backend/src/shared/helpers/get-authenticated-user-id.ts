import { Request, Response } from 'express';

export function getAuthenticatedUserId(req: Request, res: Response): string | undefined {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  return userId;
}
