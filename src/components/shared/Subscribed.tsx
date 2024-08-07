"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function Subscribed() {
  const { userClaims } = useAuth();

  return (
    <span className="max-w-screen">{`You're a ${userClaims?.stripeRole} user!`}</span>
  );
}
