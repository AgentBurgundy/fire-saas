import {
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import firebase_app from "./firebaseClient";
import { FirebaseError } from "firebase/app";
import { getAuthErrorMessage } from "./getAuthErrorMessage";

const auth = getAuth(firebase_app);

/**
 * Represents the result of a sign-in operation
 */
interface SignInResult {
  user: UserCredential | null;
  error: string | null;
}

/**
 * Enum for supported sign-in methods
 */
export enum SignInMethod {
  EmailPassword = "email_password",
  Google = "google",
  // Add other methods as needed (e.g., Facebook, Twitter, etc.)
}

/**
 * Signs in a user using the specified method.
 *
 * @param method - The sign-in method to use
 * @param options - An object containing the credentials and/or signup callback
 * @returns A promise that resolves to an object containing the user credential or a user-friendly error message
 *
 * @example
 * // Email and password sign-in
 * try {
 *   const { user, error } = await signIn(SignInMethod.EmailPassword, { email: "user@example.com", password: "password123" });
 *   if (user) {
 *     console.log("Signed in successfully:", user);
 *   } else {
 *     console.error("Sign-in failed:", error);
 *   }
 * } catch (error) {
 *   console.error("Unexpected error during sign-in:", error);
 * }
 *
 * // Google sign-in
 * try {
 *   const { user, error } = await signIn(SignInMethod.Google, { signupCallback: async () => { console.log("New Google user signed up"); } });
 *   if (user) {
 *     console.log("Signed in with Google successfully:", user);
 *   } else {
 *     console.error("Google sign-in failed:", error);
 *   }
 * } catch (error) {
 *   console.error("Unexpected error during Google sign-in:", error);
 * }
 */
export async function signIn(
  method: SignInMethod,
  options?: {
    credentials?: { email: string; password: string };
    signupCallback?: (user: UserCredential) => Promise<void>;
  }
): Promise<SignInResult> {
  try {
    let userCredential: UserCredential;

    switch (method) {
      case SignInMethod.EmailPassword:
        if (!options?.credentials) {
          throw new Error(
            "Email and password are required for email/password sign-in"
          );
        }
        userCredential = await signInWithEmailAndPassword(
          auth,
          options.credentials.email,
          options.credentials.password
        );
        break;

      case SignInMethod.Google:
        const googleProvider = new GoogleAuthProvider();
        userCredential = await signInWithPopup(auth, googleProvider);

        const creationTime = new Date(
          userCredential.user.metadata.creationTime || 0
        );
        const now = new Date();
        const timeDifference = now.getTime() - creationTime.getTime();
        const isNewUser = timeDifference < 10000;

        if (isNewUser && options?.signupCallback) {
          await options.signupCallback(userCredential);
        }
        break;

      default:
        throw new Error(`Unsupported sign-in method: ${method}`);
    }

    return { user: userCredential, error: null };
  } catch (error) {
    console.error("Sign-in error:", error);
    const errorMessage =
      error instanceof FirebaseError
        ? getAuthErrorMessage(error)
        : "An unexpected error occurred. Please try again later.";
    return { user: null, error: errorMessage };
  }
}
