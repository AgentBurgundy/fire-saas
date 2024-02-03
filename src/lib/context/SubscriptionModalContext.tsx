"use client";

import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import { useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const SubscriptionModalContext = createContext<{
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showSubscriptionModal: false,
  setShowSubscriptionModal: () => {},
});

export const useSubscriptionModal = () => useContext(SubscriptionModalContext);

export const SubscriptionModalProvider = ({ children }: any) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const searchParams = useSearchParams();
  const showPricing = searchParams.get("showPricing");

  useEffect(() => {
    if (showPricing === "true") {
      setShowSubscriptionModal(true);
    }
  }, [showPricing]);

  return (
    <SubscriptionModalContext.Provider
      value={{ showSubscriptionModal, setShowSubscriptionModal }}
    >
      {children}

      <SubscriptionModal modalOpen={showSubscriptionModal} />
    </SubscriptionModalContext.Provider>
  );
};
