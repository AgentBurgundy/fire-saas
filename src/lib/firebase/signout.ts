import { Auth, signOut } from "firebase/auth";
import firebase_app from "./firebaseClient";
import { getAuth } from "firebase/auth";

const defaultAuth = getAuth(firebase_app);

/**
 * Interface for the sign-out result
 */
interface SignOutResult {
  success: boolean;
  error: Error | null;
}

/**
 * Signs out the current user and clears authentication cookies.
 *
 * This function signs out the user from Firebase Authentication,
 * clears any authentication cookies, and performs any necessary
 * cleanup operations.
 *
 * @param {Auth} [auth] - The Auth object to use for sign out (You shouldn't pass this in, it's for testing)
 * @param {() => Promise<void>} [cleanup] - Optional cleanup function to be called after signout
 * @returns {Promise<SignOutResult>} A promise that resolves to an object
 * containing the success status and any error that occurred.
 *
 * @example
 * try {
 *   const { success, error } = await signout(async () => {
 *     // Custom cleanup logic
 *     await clearCustomState();
 *     resetAppState();
 *   });
 *   if (success) {
 *     console.log("User signed out successfully");
 *     // Redirect to home page or login page
 *   } else {
 *     console.error("Sign out failed:", error?.message);
 *     // Handle sign out failure (e.g., show an error message)
 *   }
 * } catch (error) {
 *   console.error("Unexpected error during sign out:", error);
 *   // Handle unexpected errors
 * }
 */
export default async function signout(
  cleanup: () => Promise<void> = () => Promise.resolve(),
  auth: Auth = defaultAuth
): Promise<SignOutResult> {
  try {
    await signOut(auth);

    // Perform any additional cleanup here
    localStorage.clear();
    sessionStorage.clear();

    // Execute the cleanup callback
    await cleanup();

    return { success: true, error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("An unknown error occurred during sign out"),
    };
  }
}
