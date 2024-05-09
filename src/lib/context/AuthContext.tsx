"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseClient";
import { User, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { DefaultCookieManager } from "../cookies/DefaultCookieManager";

const AuthContext = createContext<{
  currentUser: User | null;
  userClaims: string | null;
  isLoadingAuth: boolean;
}>({
  currentUser: null,
  userClaims: null,
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
  const [userClaims, setUserClaims] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const refreshToken = async () => {
    const user = auth.currentUser;
    if (user) {
      await user.getIdToken(true); // Force token refresh
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoadingAuth(false);

        // Fetch the ID token and decode it to get the claims
        const refreshAndSetClaims = async () => {
          console.log("Refreshing token and setting claims");

          await refreshToken(); // Force token refresh
          const tokenResult = await user.getIdTokenResult();
          setUserClaims(tokenResult.claims); // Update claims with refreshed token
        };

        refreshAndSetClaims();

        DefaultCookieManager.addAuthCookie(user.uid);

        // mixpanel.identify(user.uid);
        // mixpanel.people.set({
        //   $email: user.email,
        //   $name: user.displayName,
        // });

        //mixpanel.track("User Authenticated");
      } else {
        setCurrentUser(null);
        setIsLoadingAuth(false);
        setUserClaims(null); // Reset claims to null if not authenticated

        DefaultCookieManager.removeAuthCookie();
      }
    });

    return () => unsubscribe();
  }, []);

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
    userClaims,
    isLoadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
