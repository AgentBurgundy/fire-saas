import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * Retrieves a Stripe instance, creating one if it doesn't exist.
 *
 * This function ensures that only one Stripe instance is created and reused.
 * It uses the NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY from environment variables.
 *
 * @returns {Promise<Stripe>} A promise that resolves to a Stripe instance.
 * @throws {Error} If the Stripe publishable key is not set or if Stripe fails to load.
 *
 * @example
 * try {
 *   const stripe = await getStripe();
 *   // Use stripe instance...
 * } catch (error) {
 *   console.error('Failed to load Stripe:', error);
 * }
 */
const getStripe = async (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      return null;
    }

    stripePromise = loadStripe(publishableKey).then((stripe) => {
      if (!stripe) {
        return null;
      }
      return stripe;
    });
  }

  const stripe = await stripePromise;
  if (!stripe) {
    return null;
  }

  return stripe;
};

export default getStripe;
