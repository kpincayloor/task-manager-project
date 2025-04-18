import request from 'supertest';
import app from '../../../../../src/app';

jest.mock('firebase-admin', () => {
  const taskDoc = {
    id: 'task-id-123',
    exists: true,
    data: () => ({
      title: 'Task 1',
      description: 'desc',
      completed: false,
      userId: 'user-id',
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    }),
  };

  const taskCollection = {
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve(taskDoc)),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
    })),
    where: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ empty: false, docs: [taskDoc] })),
    })),
    get: jest.fn(() => Promise.resolve({ empty: false, docs: [taskDoc] })),
  };

  const usersCollection = {
    doc: jest.fn(() => ({
      collection: jest.fn(() => taskCollection),
    })),
  };

  return {
    apps: [],
    initializeApp: jest.fn(),
    firestore: () => ({
      collection: jest.fn((name: string) => {
        if (name === 'users') return usersCollection;
        return taskCollection;
      }),
    }),
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'user-id',
        email: 'test@example.com',
      }),
    }),
  };
});

const authHeader = { Authorization: 'Bearer fake-token' };

describe('[Integration] Task Controller', () => {
  it('should get all tasks', async () => {
    const res = await request(app).get('/api/tasks').set(authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title', 'Task 1');
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set(authHeader)
      .send({ title: 'New Task', description: 'Description' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'New Task');
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put('/api/tasks/task-id-123')
      .set(authHeader)
      .send({ title: 'Updated Task', completed: true });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Task');
  });

  it('should delete a task', async () => {
    const res = await request(app).delete('/api/tasks/task-id-123').set(authHeader);

    expect(res.status).toBe(204);
  });
});
