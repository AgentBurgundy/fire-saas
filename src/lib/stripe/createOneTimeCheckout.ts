import toast from "react-hot-toast";
import getStripe from "./getStripe";

/**
 * Creates a one-time checkout session with Stripe and redirects the user to the checkout page.
 *
 * This function is specifically designed for one-time payments and should not be used for subscriptions.
 * It creates a checkout session using the provided price ID, then redirects the user to the Stripe checkout page.
 *
 * @async
 * @param {string} priceId - The Stripe Price ID for the product or service being purchased.
 * @throws {Error} If there's an issue loading Stripe, creating the checkout session, or redirecting to checkout.
 *
 * @example
 * try {
 *   await createOneTimeCheckout('price_1234567890');
 * } catch (error) {
 *   console.error('Checkout failed:', error);
 *   // Handle the error (error message is already displayed via toast)
 * }
 *
 * @returns {Promise<void>}
 */
export default async function createOneTimeCheckout(
  priceId: string
): Promise<void> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error("Failed to load Stripe");
    }

    const res = await fetch("/api/stripe/checkout_session", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const { id } = await res.json();
    const { error } = await stripe.redirectToCheckout({ sessionId: id });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}
