"use client";

import { StripeProductData } from "@/lib/stripe/types/StripeProductData";
import SubscriptionCard from "./SubscriptionCard";

export default function SubscriptionCardContainer({
  products,
  salesCall,
}: {
  products: StripeProductData[];
  salesCall?: string;
}) {
  return (
    <div className="flex flex-col space-y-10 items-center justify-center w-full">
      {salesCall && (
        <span className="text-center text-3xl font-bold w-1/2">
          {salesCall}
        </span>
      )}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 w-full max-w-xs md:max-w-3xl">
        {products.map((product: StripeProductData) => {
          return <SubscriptionCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
