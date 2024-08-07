/**
 * Formats a Stripe amount (in cents) to a localized currency string.
 *
 * This function takes a Stripe amount, which is typically in the smallest currency unit (e.g., cents for USD),
 * and formats it as a localized currency string. It defaults to USD but can be used with other currencies.
 *
 * @param {number} amount - The amount in the smallest currency unit (e.g., cents for USD).
 * @param {string} [currency="usd"] - The ISO 4217 currency code (default is "usd").
 * @returns {string} A formatted currency string (e.g., "$10.00" for 1000 cents).
 *
 * @example
 * const formattedPrice = formatStripeAmount(1000); // Returns "$10.00"
 * const formattedEuroPrice = formatStripeAmount(1000, "eur"); // Returns "€10.00"
 */
export default function formatStripeAmount(
  amount: number,
  currency: string = "usd"
): string {
  const dollars = amount / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
}
