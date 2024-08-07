import signout from "@/lib/firebase/signout";
import { Auth, signOut } from "firebase/auth";

// Mock the entire firebase/auth module
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signOut: jest.fn(),
}));

// Mock the firebaseClient module
jest.mock("../../../lib/firebase/firebaseClient", () => ({
  __esModule: true,
  default: {},
}));

describe("signout", () => {
  let mockAuth: jest.Mocked<Auth>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    // Create a mock Auth object
    mockAuth = {
      signOut: jest.fn(),
    } as unknown as jest.Mocked<Auth>;

    // Make getAuth return our mockAuth
    (require("firebase/auth").getAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  it("should sign out successfully", async () => {
    const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
    mockSignOut.mockResolvedValue();

    const result = await signout(async () => {}, mockAuth);

    expect(mockSignOut).toHaveBeenCalledWith(mockAuth);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(result).toEqual({ success: true, error: null });
  });

  it("should handle sign out error", async () => {
    const mockError = new Error("Sign out failed");
    const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
    mockSignOut.mockRejectedValue(mockError);

    const result = await signout(async () => {}, mockAuth);

    expect(mockSignOut).toHaveBeenCalledWith(mockAuth);
    expect(result).toEqual({ success: false, error: mockError });
  });

  it("should execute cleanup callback", async () => {
    const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
    mockSignOut.mockResolvedValue();

    const mockCleanup = jest.fn().mockResolvedValue(undefined);
    await signout(mockCleanup, mockAuth);

    expect(mockCleanup).toHaveBeenCalled();
  });

  it("should handle non-Error objects", async () => {
    const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
    mockSignOut.mockRejectedValue("String error");

    const result = await signout(async () => {}, mockAuth);

    expect(result).toEqual({
      success: false,
      error: new Error("An unknown error occurred during sign out"),
    });
  });
});
