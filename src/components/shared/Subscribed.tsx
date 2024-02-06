"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function Subscribed() {
  const { currentUser, userRole, isLoadingAuth } = useAuth();

  return <span>{`You're a {userRole} user!`}</span>;
}
