import formatStripeAmount from "../stripe/formatStripePrice";
import { StripePriceData } from "../types/StripePriceData";
import { StripeProductData } from "../types/StripeProductData";

export default async function fetchStripeProducts(): Promise<{
  products: StripeProductData[];
}> {
  let activeProducts: StripeProductData[] = [];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const { products } = (await response.json()) as {
    products: StripeProductData[];
  };

  for (const product of products) {
    if (product.active) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${product.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product prices");
      }

      const { priceInfo } = (await response.json()) as {
        priceInfo: StripePriceData;
      };

      product.price = priceInfo;
      product.price.formatted_price = formatStripeAmount(
        product.price.unit_amount
      );

      activeProducts.push(product);
    }
  }

  return {
    products: activeProducts,
  };
}
