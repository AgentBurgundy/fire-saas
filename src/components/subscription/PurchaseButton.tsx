"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import getStripe from "@/lib/stripe/getStripe";
import {
  DocumentReference,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Props for the PurchaseButton component.
 * @interface PurchaseButtonProps
 */
interface PurchaseButtonProps {
  /** Text to display on the button */
  buttonText: string;
  /** Stripe price ID for the product */
  priceId: string;
  /** Whether this button represents a popular option */
  popular?: boolean;
  /** URL to redirect to after successful purchase */
  successUrl?: string;
  /** URL to redirect to if purchase is cancelled */
  cancelUrl?: string;
}

/**
 * PurchaseButton component for initiating a Stripe checkout session.
 * @param {PurchaseButtonProps} props - The props for the component
 * @returns {JSX.Element} The rendered button
 */
export default function PurchaseButton({
  buttonText,
  priceId,
  popular = false,
  successUrl = "/app/dashboard",
  cancelUrl = "/",
}: PurchaseButtonProps) {
  const { currentUser, userClaims } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkoutSessionDocRef, setCheckoutSessionDocRef] =
    useState<DocumentReference | null>(null);
  const router = useRouter();

  /**
   * Handles the button click event to initiate the purchase process.
   */
  const onClickBuy = async () => {
    if (!currentUser) {
      localStorage.setItem("showPricing", "true");
      router.push("/login");
      return;
    }

    if (!priceId) {
      console.error("No priceId provided");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, "users", currentUser.uid, "checkout_sessions"),
        {
          price: priceId,
          success_url: `${window.location.origin}${successUrl}`,
          cancel_url: `${window.location.origin}${cancelUrl}`,
        }
      );

      setCheckoutSessionDocRef(docRef);
      setLoading(true);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setLoading(false);
    }
  };

  /**
   * Effect to handle the creation and redirection of Stripe checkout session.
   */
  useEffect(() => {
    if (!checkoutSessionDocRef) return;

    const unsubscribe = onSnapshot(checkoutSessionDocRef, async (doc) => {
      const data = doc.data();
      if (data?.sessionId) {
        const stripe = await getStripe();
        if (!stripe) {
          console.error("Stripe not initialized");
          setLoading(false);
          return;
        }

        setCheckoutSessionDocRef(null);
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [checkoutSessionDocRef]);

  const isDisabled = userClaims?.role === "premium" || loading;

  return (
    <button
      disabled={isDisabled}
      onClick={onClickBuy}
      className={`btn ${popular ? "btn-primary" : "btn-secondary"}`}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        buttonText
      )}
    </button>
  );
}
