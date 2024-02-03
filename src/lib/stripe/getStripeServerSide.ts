import Stripe from "stripe";

export async function getStripeServerSide() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  return stripe;
}
