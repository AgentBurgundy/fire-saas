import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/**
 * Initializes and returns a Stripe instance for server-side operations.
 *
 * This function ensures that only one Stripe instance is created and reused.
 * It uses the STRIPE_SECRET_KEY from environment variables.
 *
 * @returns {Promise<Stripe>} A promise that resolves to a Stripe instance.
 * @throws {Error} If the Stripe secret key is not set or if Stripe initialization fails.
 *
 * @example
 * try {
 *   const stripe = await getStripeServerSide();
 *   // Use stripe instance for server-side operations...
 * } catch (error) {
 *   console.error('Failed to initialize Stripe:', error);
 * }
 */
export async function getStripeServerSide(): Promise<Stripe | null> {
  if (stripeInstance) {
    return stripeInstance;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  try {
    stripeInstance = new Stripe(secretKey);

    return stripeInstance;
  } catch (error) {
    console.error("Error initializing Stripe:", error);
    return null;
  }
}
