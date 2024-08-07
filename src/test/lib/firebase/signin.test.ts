import { signIn, SignInMethod } from "@/lib/firebase/signin";
import { FirebaseError } from "firebase/app";
import { UserCredential } from "firebase/auth";

// Mock the Firebase auth methods
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  getAuth: jest.fn(() => ({})),
}));

// Mock the getAuthErrorMessage function
jest.mock("../../../lib/firebase/getAuthErrorMessage", () => ({
  getAuthErrorMessage: jest.fn((error) => `Mocked error: ${error.code}`),
}));

// Mock the Firebase client
jest.mock("../../../lib/firebase/firebaseClient", () => ({
  default: {},
}));

describe("signIn function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign in with email and password successfully", async () => {
    const mockUserCredential = { user: { uid: "123" } } as UserCredential;
    require("firebase/auth").signInWithEmailAndPassword.mockResolvedValue(
      mockUserCredential
    );

    const result = await signIn(SignInMethod.EmailPassword, {
      credentials: { email: "test@example.com", password: "password123" },
    });

    expect(result).toEqual({ user: mockUserCredential, error: null });
    expect(
      require("firebase/auth").signInWithEmailAndPassword
    ).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123"
    );
  });

  it("should sign in with Google successfully", async () => {
    const mockUserCredential = {
      user: {
        uid: "123",
        metadata: { creationTime: new Date().toISOString() },
      },
    } as UserCredential;
    require("firebase/auth").signInWithPopup.mockResolvedValue(
      mockUserCredential
    );

    const mockSignupCallback = jest.fn();
    const result = await signIn(SignInMethod.Google, {
      signupCallback: mockSignupCallback,
    });

    expect(result).toEqual({ user: mockUserCredential, error: null });
    expect(require("firebase/auth").signInWithPopup).toHaveBeenCalled();
    expect(mockSignupCallback).toHaveBeenCalledWith(mockUserCredential);
  });

  it("should handle errors for invalid credentials", async () => {
    const mockError = new FirebaseError(
      "auth/wrong-password",
      "Invalid password"
    );
    require("firebase/auth").signInWithEmailAndPassword.mockRejectedValue(
      mockError
    );

    const result = await signIn(SignInMethod.EmailPassword, {
      credentials: { email: "test@example.com", password: "wrongpassword" },
    });

    expect(result).toEqual({
      user: null,
      error: "Mocked error: auth/wrong-password",
    });
  });

  it("should throw an error for unsupported sign-in method", async () => {
    await expect(signIn("unsupported" as SignInMethod)).resolves.toEqual({
      user: null,
      error: "An unexpected error occurred. Please try again later.",
    });
  });

  it("should not call signupCallback for existing Google users", async () => {
    const mockUserCredential = {
      user: {
        uid: "123",
        metadata: { creationTime: "2023-01-01T00:00:00.000Z" },
      },
    } as UserCredential;
    require("firebase/auth").signInWithPopup.mockResolvedValue(
      mockUserCredential
    );

    const mockSignupCallback = jest.fn();
    await signIn(SignInMethod.Google, {
      signupCallback: mockSignupCallback,
    });

    expect(mockSignupCallback).not.toHaveBeenCalled();
  });
});
