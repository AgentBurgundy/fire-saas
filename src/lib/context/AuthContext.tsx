"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { DefaultCookieManager } from "../cookies/DefaultCookieManager";
import { AuthService } from "../auth/AuthService";

type UserClaims = {
  [key: string]: any;
};

interface AuthContextType {
  currentUser: User | null;
  userClaims: UserClaims | null;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userClaims: null,
  isLoadingAuth: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
  authService: AuthService;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  authService,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userClaims, setUserClaims] = useState<UserClaims | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);

      if (user) {
        const claims = await authService.getUserClaims(user);
        setUserClaims(claims);
        DefaultCookieManager.addAuthCookie(user.uid);
      } else {
        setUserClaims(null);
        DefaultCookieManager.removeAuthCookie();
      }
    });

    return () => unsubscribe();
  }, [authService]);

  useEffect(() => {
    if (isLoadingAuth) return;

    if (!currentUser && pathname.startsWith("/app")) {
      router.push("/login");
    } else if (currentUser && pathname.startsWith("/login")) {
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
