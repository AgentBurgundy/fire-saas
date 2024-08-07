import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/lib/context/AuthContext";
import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth/AuthService";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock the DefaultCookieManager
jest.mock("../../../lib/cookies/DefaultCookieManager", () => ({
  DefaultCookieManager: {
    addAuthCookie: jest.fn(),
    removeAuthCookie: jest.fn(),
  },
}));

describe("AuthContext", () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUsePathname: jest.Mock;
  let mockUseRouter: jest.Mock;

  beforeEach(() => {
    mockAuthService = {
      onAuthStateChanged: jest.fn().mockReturnValue(jest.fn()), // Return a mock unsubscribe function
      getUserClaims: jest.fn(),
    } as jest.Mocked<AuthService>;

    mockUsePathname = usePathname as jest.Mock;
    mockUseRouter = useRouter as jest.Mock;

    mockUsePathname.mockReturnValue("/");
    mockUseRouter.mockReturnValue({ push: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuthProvider = (component: React.ReactNode) => {
    return render(
      <AuthProvider authService={mockAuthService}>{component}</AuthProvider>
    );
  };

  it("provides initial auth state", () => {
    const TestComponent = () => {
      const { currentUser, userClaims, isLoadingAuth } = useAuth();
      return (
        <div>
          <div data-testid="loading">{isLoadingAuth.toString()}</div>
          <div data-testid="user">
            {currentUser ? "logged in" : "not logged in"}
          </div>
          <div data-testid="claims">{JSON.stringify(userClaims)}</div>
        </div>
      );
    };

    const { getByTestId } = renderWithAuthProvider(<TestComponent />);

    expect(getByTestId("loading").textContent).toBe("true");
    expect(getByTestId("user").textContent).toBe("not logged in");
    expect(getByTestId("claims").textContent).toBe("null");
  });

  it("updates auth state when user logs in", async () => {
    const mockUser = { uid: "123" } as User;
    const mockClaims = { role: "user" };

    mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
      callback(mockUser);
      return jest.fn(); // Return a mock unsubscribe function
    });

    mockAuthService.getUserClaims.mockResolvedValue(mockClaims);

    const TestComponent = () => {
      const { currentUser, userClaims, isLoadingAuth } = useAuth();
      return (
        <div>
          <div data-testid="loading">{isLoadingAuth.toString()}</div>
          <div data-testid="user">
            {currentUser ? "logged in" : "not logged in"}
          </div>
          <div data-testid="claims">{JSON.stringify(userClaims)}</div>
        </div>
      );
    };

    const { getByTestId } = renderWithAuthProvider(<TestComponent />);

    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("user").textContent).toBe("logged in");
      expect(getByTestId("claims").textContent).toBe(
        JSON.stringify(mockClaims)
      );
    });
  });

  it("redirects to login when accessing protected route without auth", async () => {
    mockUsePathname.mockReturnValue("/app/dashboard");
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });

    mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
      callback(null);
      return jest.fn(); // Return a mock unsubscribe function
    });

    renderWithAuthProvider(<div>Protected Content</div>);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects to dashboard when accessing login route while authenticated", async () => {
    mockUsePathname.mockReturnValue("/login");
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });

    const mockUser = { uid: "123" } as User;
    mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
      callback(mockUser);
      return jest.fn(); // Return a mock unsubscribe function
    });

    mockAuthService.getUserClaims.mockResolvedValue({});

    renderWithAuthProvider(<div>Login Page</div>);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/app/dashboard");
    });
  });
});
