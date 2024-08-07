"use client";

import { useAuth } from "@/lib/context/AuthContext";
import createPortalLink from "@/lib/stripe/createPortalLink";
import toast from "react-hot-toast";
import SubscriptionModalReminder from "../subscription/SubscriptionModalReminder";

export default function ManageAccount() {
  const { userClaims } = useAuth();

  const handleManage = async () => {
    const url = await createPortalLink();
    if (!url) {
      toast.error("An error occurred while creating the portal link");
      return;
    }

    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col space-y-4 items-center justify-center py-4 px-16 bg-neutral-content rounded-xl">
      <span>Your Billing</span>
      {userClaims?.stripeRole !== "Free" && (
        <button onClick={handleManage} className="btn btn-primary">
          Manage Subscription
        </button>
      )}
      {userClaims?.stripeRole === "Free" && <SubscriptionModalReminder />}
    </div>
  );
}
