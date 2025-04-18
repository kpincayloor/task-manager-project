import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../shared/services/auth.service';
import { DecodedAuthToken } from '../../shared/types/auth-token.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedAuthToken;
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: Token missing' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    const errorMessage = (error as Error)?.message || 'Unauthorized: Invalid token';
    res.status(401).json({ message: errorMessage });
  }
};
