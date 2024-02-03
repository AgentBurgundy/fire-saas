import {
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import firebase_app from "./firebaseClient";

const auth = getAuth(firebase_app);

export async function signInOrCreateAccount(email: string, password: string) {
  let result = null,
    error = null;

  try {
    // Try to sign in
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (signInError: any) {
    // If sign in fails, try to create a new user
    if (
      signInError.code === "auth/user-not-found" ||
      signInError.code === "auth/invalid-credential"
    ) {
      try {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } catch (createError) {
        error = createError;
      }
    } else {
      error = signInError;
    }
  }

  return { result, error };
}

export async function signInGoogle() {
  let result = null,
    error = null;
  try {
    result = await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    error = e;
  }

  return { result, error };
}
