import request from 'supertest';
import app from '../../../../../src/app';

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  firestore: () => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'user-id',
          data: () => ({
            email: 'test@example.com',
            createdAt: { toDate: () => new Date() },
          }),
        },
      ],
    }),
    where: jest.fn().mockReturnThis(),
  }),
  auth: () => ({
    createCustomToken: jest.fn().mockResolvedValue('fake-token'),
    createUser: jest.fn().mockResolvedValue({ uid: 'uid123' }),
  }),
}));

describe('[Integration] User Routes', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/api/users').send({ email: 'test@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should return a token and user if user exists', async () => {
    const email = 'test@example.com';
    const res = await request(app).get(`/api/users`).query({ email });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', email);
  });
});
