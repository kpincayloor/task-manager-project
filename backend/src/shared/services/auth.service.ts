import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const verifyToken = async (token: string): Promise<{ id: string; email: string }> => {
  const decoded = await admin.auth().verifyIdToken(token);
  return {
    id: decoded.uid,
    email: decoded.email || '',
  };
};
