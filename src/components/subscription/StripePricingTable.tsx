"use client";

// In case you'd like to embed a pricing table, here how's to do it.

import React, { useEffect } from "react";
const StripePricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return React.createElement("stripe-pricing-table", {
    "pricing-table-id": "<your-pricing-table-id>",
    "publishable-key": "<your-stripe-publishable-key>",
  });
};
export default StripePricingTable;
