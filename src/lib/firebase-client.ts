import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  appId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

const config: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

const envVarNames: Record<keyof FirebaseConfig, string> = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
};

const requiredKeys: Array<keyof FirebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

let firebaseApp: FirebaseApp | null = null;

const validateConfig = () => {
  const missing = requiredKeys.filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(
      `Missing Firebase env variables: ${missing
        .map((key) => envVarNames[key])
        .join(", ")}`,
    );
  }
};

export const getFirebaseApp = (): FirebaseApp => {
  if (firebaseApp) {
    return firebaseApp;
  }

  validateConfig();

  const existing = getApps();
  firebaseApp = existing.length ? existing[0] : initializeApp(config);
  return firebaseApp;
};

export const getFirebaseAuth = (): Auth => getAuth(getFirebaseApp());

export const getFirebaseFirestore = (): Firestore =>
  getFirestore(getFirebaseApp());

