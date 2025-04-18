import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserProps } from '../../domain/models/User';
import { db } from '../../shared/config/firebase';

export class FirestoreUserRepository implements IUserRepository {
  private collection = db.collection('users');

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    const userProps: UserProps = {
      id: doc.id,
      email: data.email,
      createdAt: data.createdAt.toDate(),
    };

    return new User(userProps);
  }

  async create(user: User): Promise<void> {
    const data = user.toPrimitives();
    await this.collection.doc(data.id).set(data);
  }
}
