import React from "react";
import { render } from "@testing-library/react";
import SubscriptionCardContainer from "@/components/subscription/SubscriptionCardContainer";
import { StripeProductData } from "@/lib/stripe/types/StripeProductData";
import { mockStripeProducts } from "@/test/utils/mockStripeData";

// Mock the SubscriptionCard component
jest.mock("../../../components/subscription/SubscriptionCard", () => {
  return function MockSubscriptionCard({
    product,
  }: {
    product: StripeProductData;
  }) {
    return (
      <div data-testid={`subscription-card-${product.id}`}>{product.name}</div>
    );
  };
});

describe("SubscriptionCardContainer", () => {
  const mockProducts = mockStripeProducts;

  it("renders without crashing", () => {
    const { getByTestId } = render(
      <SubscriptionCardContainer products={mockProducts} />
    );
    expect(getByTestId("subscription-card-prod_basic")).toBeInTheDocument();
    expect(getByTestId("subscription-card-prod_premium")).toBeInTheDocument();
  });

  it("displays the sales call when provided", () => {
    const salesCall = "Special offer!";
    const { getByText } = render(
      <SubscriptionCardContainer
        products={mockProducts}
        salesCall={salesCall}
      />
    );
    expect(getByText(salesCall)).toBeInTheDocument();
  });

  it("does not display the sales call when not provided", () => {
    const { queryByText } = render(
      <SubscriptionCardContainer products={mockProducts} />
    );
    expect(queryByText(/Special offer!/)).not.toBeInTheDocument();
  });

  it("renders the correct number of SubscriptionCard components", () => {
    const { getAllByTestId } = render(
      <SubscriptionCardContainer products={mockProducts} />
    );
    const cards = getAllByTestId(/subscription-card-/);
    expect(cards).toHaveLength(mockProducts.length);
  });
});
