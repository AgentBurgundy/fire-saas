import { FirebaseError } from "firebase/app";

/**
 * Converts Firebase AuthError codes to user-friendly error messages.
 *
 * @param error - The AuthError object from Firebase
 * @returns A user-friendly error message string
 */
export function getAuthErrorMessage(error: FirebaseError): string {
  switch (error.code) {
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "The password is too weak. Please choose a stronger password.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "The sign-in popup was closed before completing the sign-in process.";
    case "auth/cancelled-popup-request":
      return "The sign-in process was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "The sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not allowed. Please contact support.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but different sign-in credentials. Try signing in with a different method.";
    // Add more cases as needed
    default:
      return "An unexpected error occurred. Please try again later.";
  }
}
