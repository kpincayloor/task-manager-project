import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

const firebaseConfig = {
  apiKey: `${environment.apiKey}`,
  authDomain: `${environment.projectId}.firebaseapp.com`,
  projectId: `${environment.projectId}`,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
