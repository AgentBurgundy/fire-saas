"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseClient";
import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DefaultCookieManager } from "../cookies/DefaultCookieManager";

const AuthContext = createContext<{
  currentUser: User | null;
  userRole: string | null;
  isLoadingAuth: boolean;
}>({
  currentUser: null,
  userRole: null,
  isLoadingAuth: true,
});

export const useAuth = () => useContext(AuthContext);

/**
 * The AuthProvider looks pretty complicated but it's not too crazy what we're doing here.
 *
 * We're using the `onAuthStateChanged` method from the firebase auth SDK to listen for changes in the user's authentication state.
 *
 * When the user logs in or out, we update the `currentUser` state with the new user object or null.
 *
 * We also use the `getIdTokenResult` method to get the user's role from the token and store it in the `userRole` state.
 *
 * We also use the `usePathname` and `useRouter` hooks from `next/navigation` to redirect the user based on their authentication state.
 *
 * @param param0
 * @returns
 */
export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  // Listen for changes in the user's authentication state, store the UID cookie and the currentUser state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoadingAuth(false);

        DefaultCookieManager.addAuthCookie(user.uid);
      } else {
        setCurrentUser(null);
        setIsLoadingAuth(false);

        DefaultCookieManager.removeAuthCookie();
      }
    });

    return () => unsubscribe();
  }, []);

  // Populate the user's role from their token's stripeRole claim
  useEffect(() => {
    const getUserRoleFromToken = async () => {
      const decodedToken = await getIdTokenResult(currentUser, true);

      setUserRole((decodedToken?.claims?.stripeRole as string) ?? "Free");
    };

    if (currentUser) {
      getUserRoleFromToken();
    }
  }, [currentUser]);

  // Redirect based on authentication state
  useEffect(() => {
    // Edit your auth pathing here
    if (isLoadingAuth) {
      return;
    }

    // If not signed in and trying to access an app page, redirect to login
    if (!currentUser && pathname.startsWith("/app")) {
      router.push("/login");
    }

    // If signed in and on the login page, redirect to dashboard
    if (currentUser && pathname.startsWith("/login")) {
      router.push("/app/dashboard");
    }
  }, [currentUser, pathname, router, isLoadingAuth]);

  const value = {
    currentUser,
    userRole,
    isLoadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
