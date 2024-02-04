"use client";

import { StripePriceData } from "@/lib/types/StripePriceData";
import PurchaseButton from "./PurchaseButton";
import formatStripeAmount from "@/lib/stripe/formatStripePrice";
import { useState, useEffect } from "react";

/**
 * Adjust this map to match your plan names and product features you'd like to display
 */
const featuresMap: any = {
  "Basic Plan": ["Feature 1", "Feature 2", "Feature 3"],
  "Premium Plan": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
};

export default function SubscriptionCard({
  productId,
  buttonText,
  planName,
  popular = false,
}: any) {
  const [priceData, setPriceData] = useState<StripePriceData | null>(null);

  useEffect(() => {
    const fetchPriceData = async (
      productId: string
    ): Promise<StripePriceData | null> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${productId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return (await response.json()).priceInfo as StripePriceData;
      } catch (error: any) {
        console.error("Error fetching price data", error);
        return null;
      }
    };

    fetchPriceData(productId).then((data) => {
      setPriceData(data);
    });
  }, [productId]);

  if (!priceData) {
    return <p>Loading...</p>;
  }

  const price = formatStripeAmount(priceData.unit_amount);

  return (
    <div
      className={`${
        popular ? "border-4 border-primary" : ""
      } relative card card-bordered w-full bg-base-100 shadow-xl`}
    >
      {popular && (
        <div className="absolute left-1/2 -translate-x-1/2 bg-primary text-base-100 px-8 py-1 rounded-b-xl">
          <span>Popular</span>
        </div>
      )}
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">
          {planName || "Loading..."}
        </h2>
        <p className="text-xl font-semibold text-gray-700">
          {price ? `${price}/month` : "Loading price..."}
        </p>

        <ul className="flex flex-col items-start justify-start h-full py-4">
          {planName && featuresMap[planName].length > 0 ? (
            featuresMap[planName].map((feature: any, index: number) => (
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
            ))
          ) : (
            <p>Loading features...</p>
          )}
        </ul>

        <div className="card-actions justify-center">
          <PurchaseButton
            priceId={priceData.id}
            buttonText={buttonText}
            popular={popular}
          />
        </div>
      </div>
    </div>
  );
}
