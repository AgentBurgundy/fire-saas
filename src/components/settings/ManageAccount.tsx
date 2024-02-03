"use client";

import { useAuth } from "@/lib/context/AuthContext";
import createPortalLink from "@/lib/stripe/createPortalLink";
import toast from "react-hot-toast";
import SubscriptionCardContainer from "../subscription/SubscriptionCardContainer";

export default function ManageAccount() {
  const { currentUser, userRole, isLoadingAuth } = useAuth();

  const handleManage = async () => {
    const url = await createPortalLink();
    if (!url) {
      toast.error("An error occurred while creating the portal link");
      return;
    }

    window.open(url, "_blank");
  };

  if (userRole === "Free") {
    return <SubscriptionCardContainer />;
  }

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-center py-4 px-16 bg-neutral-content rounded-xl">
      <button onClick={handleManage} className="btn btn-primary">
        Manage Subscription
      </button>
    </div>
  );
}
