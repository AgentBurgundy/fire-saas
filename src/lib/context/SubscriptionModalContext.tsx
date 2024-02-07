"use client";

import { createContext, useContext, useState } from "react";

const SubscriptionModalContext = createContext<{
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
}>({
  showSubscriptionModal: false,
  setShowSubscriptionModal: () => {},
});

export const useSubscriptionModal = () => useContext(SubscriptionModalContext);

export const SubscriptionModalProvider = ({ children }: any) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <SubscriptionModalContext.Provider
      value={{ showSubscriptionModal, setShowSubscriptionModal }}
    >
      {children}
    </SubscriptionModalContext.Provider>
  );
};
