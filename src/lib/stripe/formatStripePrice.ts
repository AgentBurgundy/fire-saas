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
