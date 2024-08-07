import { getAuthErrorMessage } from "@/lib/firebase/getAuthErrorMessage";
import { FirebaseError } from "firebase/app";

describe("getAuthErrorMessage", () => {
  it("should return the correct message for auth/invalid-email", () => {
    const error = new FirebaseError("auth/invalid-email", "");
    expect(getAuthErrorMessage(error)).toBe("The email address is not valid.");
  });

  it("should return the correct message for auth/user-disabled", () => {
    const error = new FirebaseError("auth/user-disabled", "");
    expect(getAuthErrorMessage(error)).toBe(
      "This account has been disabled. Please contact support."
    );
  });

  it("should return the correct message for auth/user-not-found", () => {
    const error = new FirebaseError("auth/user-not-found", "");
    expect(getAuthErrorMessage(error)).toBe(
      "Invalid email or password. Please try again."
    );
  });

  it("should return the correct message for auth/wrong-password", () => {
    const error = new FirebaseError("auth/wrong-password", "");
    expect(getAuthErrorMessage(error)).toBe(
      "Invalid email or password. Please try again."
    );
  });

  it("should return the correct message for auth/email-already-in-use", () => {
    const error = new FirebaseError("auth/email-already-in-use", "");
    expect(getAuthErrorMessage(error)).toBe(
      "An account with this email already exists."
    );
  });

  it("should return the correct message for auth/weak-password", () => {
    const error = new FirebaseError("auth/weak-password", "");
    expect(getAuthErrorMessage(error)).toBe(
      "The password is too weak. Please choose a stronger password."
    );
  });

  it("should return the correct message for auth/network-request-failed", () => {
    const error = new FirebaseError("auth/network-request-failed", "");
    expect(getAuthErrorMessage(error)).toBe(
      "Network error. Please check your internet connection and try again."
    );
  });

  it("should return the correct message for auth/too-many-requests", () => {
    const error = new FirebaseError("auth/too-many-requests", "");
    expect(getAuthErrorMessage(error)).toBe(
      "Too many unsuccessful login attempts. Please try again later."
    );
  });

  it("should return the correct message for auth/popup-closed-by-user", () => {
    const error = new FirebaseError("auth/popup-closed-by-user", "");
    expect(getAuthErrorMessage(error)).toBe(
      "The sign-in popup was closed before completing the sign-in process."
    );
  });

  it("should return the correct message for auth/cancelled-popup-request", () => {
    const error = new FirebaseError("auth/cancelled-popup-request", "");
    expect(getAuthErrorMessage(error)).toBe(
      "The sign-in process was cancelled. Please try again."
    );
  });

  it("should return the correct message for auth/popup-blocked", () => {
    const error = new FirebaseError("auth/popup-blocked", "");
    expect(getAuthErrorMessage(error)).toBe(
      "The sign-in popup was blocked by your browser. Please allow popups for this site and try again."
    );
  });

  it("should return the correct message for auth/operation-not-allowed", () => {
    const error = new FirebaseError("auth/operation-not-allowed", "");
    expect(getAuthErrorMessage(error)).toBe(
      "This sign-in method is not allowed. Please contact support."
    );
  });

  it("should return the correct message for auth/account-exists-with-different-credential", () => {
    const error = new FirebaseError(
      "auth/account-exists-with-different-credential",
      ""
    );
    expect(getAuthErrorMessage(error)).toBe(
      "An account already exists with the same email but different sign-in credentials. Try signing in with a different method."
    );
  });

  it("should return a default message for unknown error codes", () => {
    const error = new FirebaseError("auth/unknown-error", "");
    expect(getAuthErrorMessage(error)).toBe(
      "An unexpected error occurred. Please try again later."
    );
  });
});
