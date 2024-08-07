"use client";

import { StripeProductData } from "@/lib/stripe/types/StripeProductData";
import PurchaseButton from "./PurchaseButton";

/**
 * Adjust this map to match your plan names and product features you'd like to display
 */
const featuresMap: Record<string, string[]> = {
  "Basic Plan": ["Feature 1", "Feature 2", "Feature 3"],
  "Premium Plan": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
};

export default function SubscriptionCard({
  product,
}: {
  product: StripeProductData;
}) {
  const { id, name, metadata, price } = product;

  return (
    <div
      className={`${
        metadata.popular === "true" ? "border-4 border-primary" : ""
      } relative card card-bordered w-full bg-base-100 shadow-xl`}
    >
      {metadata.popular === "true" && (
        <div className="absolute left-1/2 -translate-x-1/2 bg-primary text-base-100 px-8 py-1 rounded-b-xl">
          <span>Popular</span>
        </div>
      )}
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">
          {name || "Loading..."}
        </h2>
        <p className="text-xl font-semibold text-gray-700">
          {price?.formatted_price
            ? `${price.formatted_price}/month`
            : "Loading price..."}
        </p>

        <ul className="flex flex-col items-start justify-start h-full py-4">
          {featuresMap[name].map((feature: any, index: number) => (
            <li key={index} className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="card-actions justify-center">
          {price?.id && (
            <PurchaseButton
              priceId={price.id}
              buttonText={metadata.buttonText}
              popular={metadata.popular === "true"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
