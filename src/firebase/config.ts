import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseAppletConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: firebaseAppletConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: firebaseAppletConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: firebaseAppletConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: firebaseAppletConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: firebaseAppletConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY'
);

let app: any = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const databaseId = (firebaseAppletConfig as any)?.firestoreDatabaseId;
    if (databaseId && databaseId !== '(default)') {
      db = getFirestore(app, databaseId);
    } else {
      db = getFirestore(app);
    }
    auth = getAuth(app);
    console.log('[CropCronical Firebase] Initialized Firestore with Project ID:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('Failed to initialize Firebase with provided credentials. Falling back to local mock store.', error);
  }
}

export { app, db, auth };
