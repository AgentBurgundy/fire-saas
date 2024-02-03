import toast from "react-hot-toast";
import getStripe from "./getStripe";

/**
 * If you are using a one-time payment, you can use this function to create a checkout session.
 *
 * DO NOT use this function for subscriptions. Use `createSubscriptionCheckout` instead.
 *
 * @param priceId
 * @returns
 */
export default async function createOneTimeCheckout(priceId: string) {
  const stripe = await getStripe();
  if (!stripe) {
    toast.error("Failed to load stripe");
    return;
  }

  const res = await fetch("/api/stripe/checkout_session", {
    method: "POST",
    body: JSON.stringify({ priceId }),
  });
  const { id } = await res.json();

  const { error } = await stripe.redirectToCheckout({ sessionId: id });

  if (error) {
    toast.error("Failed to redirect to checkout");
  }
}
