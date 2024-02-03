"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function Subscribed() {
  const { currentUser, userRole, isLoadingAuth } = useAuth();

  return <div>You're a {userRole} user!</div>;
}
