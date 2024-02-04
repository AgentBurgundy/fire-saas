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
    "pricing-table-id": "prctbl_1OgCflCLPADkTljcIdzPukni",
    "publishable-key":
      "pk_test_51NyS5wCLPADkTljcNsxH5B71sfFMfC1t47MFQv3JAcFWnV0yVBcfV6hvhR18igcbz1Y0IG79EtCA3vXoZ9Vjax6W008Q95NrMj",
  });
};
export default StripePricingTable;
