import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

/**
 * Firebase configuration object.
 * These values are loaded from environment variables.
 */
const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebase_app: FirebaseApp;

/**
 * Initialize Firebase app or return existing instance.
 * This prevents creating multiple instances during hot-reloads.
 */
if (!getApps().length) {
  firebase_app = initializeApp(clientCredentials);
} else {
  firebase_app = getApps()[0];
}

export default firebase_app;

/**
 * Exported Firebase service instances.
 * These can be imported and used throughout the application.
 */
export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app);
export const functions = getFunctions(firebase_app);
