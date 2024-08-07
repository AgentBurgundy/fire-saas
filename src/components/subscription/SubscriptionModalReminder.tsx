"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useSubscriptionModal } from "@/lib/context/SubscriptionModalContext";

export default function SubscriptionModalReminder() {
  const { userClaims } = useAuth();
  const { showSubscriptionModal, setShowSubscriptionModal } =
    useSubscriptionModal();

  if (userClaims?.role !== "Free") {
    return null;
  }

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => {
        setShowSubscriptionModal(true);
      }}
    >
      <span>Upgrade</span>
    </button>
  );
}
