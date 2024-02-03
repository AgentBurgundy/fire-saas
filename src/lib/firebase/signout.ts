import { getAuth, signOut } from "firebase/auth";
import firebase_app from "./firebaseClient";

const auth = getAuth(firebase_app);

export default async function signout() {
  let result = null,
    error = null;
  try {
    result = await signOut(auth);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
