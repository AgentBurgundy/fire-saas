"use client";

import { StripeProductData } from "@/lib/types/StripeProductData";
import SubscriptionCard from "./SubscriptionCard";
import { useEffect, useState } from "react";

export default function SubscriptionCardContainer({ salesCall }: any) {
  const [activeProducts, setActiveProducts] = useState<StripeProductData[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        setActiveProducts(data.products as StripeProductData[]);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        // Handle the error appropriately
      });
  }, []);

  return (
    <div className="flex flex-col space-y-10 items-center justify-center w-full">
      {salesCall && (
        <span className="text-center text-3xl font-bold w-1/2">
          {salesCall}
        </span>
      )}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 w-full max-w-xs md:max-w-3xl">
        {activeProducts.map((product: StripeProductData) => {
          return (
            <SubscriptionCard
              key={product.id}
              productId={product.id}
              planName={product.name}
              buttonText={product.metadata.buttonText}
              popular={product.metadata.popular === "true"}
            />
          );
        })}
      </div>
    </div>
  );
}
