import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, TaskProps } from '../../domain/models/Task';
import { db } from '../../shared/config/firebase';

export class FirestoreTaskRepository implements ITaskRepository {
  private collection(userId: string) {
    return db.collection('users').doc(userId).collection('tasks');
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.collection(userId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();

      const taskProps: TaskProps = {
        id: doc.id,
        userId,
        title: data.title,
        description: data.description,
        completed: data.completed,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      return new Task(taskProps);
    });
  }

  async findByUserAndTaskId(userId: string, taskId: string): Promise<Task | null> {
    const doc = await this.collection(userId).doc(taskId).get();
    if (!doc.exists) return null;

    const data = doc.data()!;

    const taskProps: TaskProps = {
      id: doc.id,
      userId: userId,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };

    return new Task(taskProps);
  }

  async create(task: Task): Promise<void> {
    const data = task.toPrimitives();
    await this.collection(data.userId).doc(data.id).set(data);
  }

  async update(task: Task): Promise<void> {
    const data = task.toPrimitives();
    await this.collection(data.userId).doc(data.id).update(data);
  }

  async deleteByUser(userId: string, taskId: string): Promise<void> {
    await this.collection(userId).doc(taskId).delete();
  }
}
