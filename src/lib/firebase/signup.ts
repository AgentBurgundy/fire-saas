import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import firebase_app from "./firebaseClient";

const auth = getAuth(firebase_app);

export default async function signUp(
  email: string,
  password: string,
  secretCode: string,
  name: string
) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);

    const signUpResponse = await fetch("/api/users/signup", {
      method: "POST",
      body: JSON.stringify({
        uid: result.user.uid,
        secretCode,
        name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!signUpResponse.ok) {
      throw new Error(await signUpResponse.text());
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
}
