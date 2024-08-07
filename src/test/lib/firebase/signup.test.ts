import signUp from "@/lib/firebase/signup";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

// Mock the entire firebase/auth module
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
}));

// Mock the firebaseClient module
jest.mock("../../../lib/firebase/firebaseClient", () => ({
  __esModule: true,
  default: {},
}));

describe("signUp function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign up a user successfully", async () => {
    const mockUserCredential = { user: { uid: "123" } } as UserCredential;
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential
    );

    const result = await signUp("test@example.com", "password123");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123"
    );
    expect(result).toEqual({ user: mockUserCredential, error: null });
  });

  it("should call the signupCallback if provided", async () => {
    const mockUserCredential = { user: { uid: "123" } } as UserCredential;
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential
    );

    const mockSignupCallback = jest.fn().mockResolvedValue(undefined);
    await signUp("test@example.com", "password123", mockSignupCallback);

    expect(mockSignupCallback).toHaveBeenCalledWith(mockUserCredential);
  });

  it("should handle sign up errors", async () => {
    const mockError = new Error("Sign up failed");
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

    const result = await signUp("test@example.com", "password123");

    expect(result).toEqual({ user: null, error: mockError });
  });

  it("should handle non-Error objects", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      "String error"
    );

    const result = await signUp("test@example.com", "password123");

    expect(result).toEqual({
      user: null,
      error: new Error("An unknown error occurred"),
    });
  });
});
