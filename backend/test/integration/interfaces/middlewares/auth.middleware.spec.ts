import request from 'supertest';
import express from 'express';
import { authenticate } from '../../../../src/interfaces/middlewares/auth.middleware';

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  auth: () => ({
    verifyIdToken: jest.fn((token: string) => {
      if (token === 'valid-token') {
        return Promise.resolve({ uid: 'user-id', email: 'test@example.com' });
      }
      return Promise.reject(new Error('Unauthorized: Invalid token'));
    }),
  }),
}));

const app = express();
app.use(express.json());
app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

describe('[Integration] Auth Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized: Token missing' });
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized: Invalid token' });
  });

  it('should allow access if token is valid', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Access granted');
    expect(res.body.user).toHaveProperty('id', 'user-id');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });
});
