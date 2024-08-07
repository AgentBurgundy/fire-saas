import {
  createUserWithEmailAndPassword,
  getAuth,
  UserCredential,
} from "firebase/auth";
import firebase_app from "./firebaseClient";

const auth = getAuth(firebase_app);

/**
 * Interface for the sign-up result
 */
interface SignUpResult {
  user: UserCredential | null;
  error: Error | null;
}

/**
 * Signs up a new user with email and password, and creates a user document in Firestore.
 *
 * @param email - The email address of the new user
 * @param password - The password for the new user
 * @param secretCode - A secret code for additional verification (optional)
 * @param name - The display name of the new user (optional)
 * @param signupCallback - A callback function to be executed for new users (optional)
 * @returns A promise that resolves to an object containing the user credential or an error
 * 
 * @example
 * // B2C signup
 * try {
 * const { user, error } = await signUp("user@example.com", "password123");
 * if (error) {
 *   console.error("B2C Sign up failed:", error.message);
 * } else {
 *   console.log("B2C Sign up successful:", user);
 * }
 * } catch (error) {
 *   console.error("Unexpected error during B2C sign up:", error);
 * }

 * // B2B or invite-only signup
 * try {
 *   const { user, error } = await signUp(
 *     "user@company.com",
 *     "password123",
 *     "John Doe",
 *     "SECRET_INVITE_CODE"
 *   );
 *   if (error) {
 *     console.error("B2B Sign up failed:", error.message);
 *   } else {
 *     console.log("B2B Sign up successful:", user);
 *   }
 * } catch (error) {
 *   console.error("Unexpected error during B2B sign up:", error);
 * }
 */
export default async function signUp(
  email: string,
  password: string,
  signupCallback?: (userCredential: UserCredential) => Promise<void>
): Promise<SignUpResult> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (signupCallback) {
      await signupCallback(userCredential);
    }

    return { user: userCredential, error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      user: null,
      error:
        error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}
