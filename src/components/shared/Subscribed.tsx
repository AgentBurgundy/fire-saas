"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function Subscribed() {
  const { userRole } = useAuth();

  return <span>{`You're a ${userRole} user!`}</span>;
}
