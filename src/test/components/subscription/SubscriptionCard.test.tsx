import React from "react";
import { render, screen } from "@testing-library/react";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import { mockStripeProducts } from "@/test/utils/mockStripeData";

// Mock the PurchaseButton component
jest.mock("../../../components/subscription/PurchaseButton", () => {
  return function MockPurchaseButton({ priceId, buttonText, popular }: any) {
    return (
      <button data-testid={`purchase-button-${priceId}`}>{buttonText}</button>
    );
  };
});

describe("SubscriptionCard", () => {
  const mockProduct = mockStripeProducts[0];

  it("renders the product name and price", () => {
    render(<SubscriptionCard product={mockProduct} />);
    expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    expect(screen.getByText("$10/month")).toBeInTheDocument();
  });

  it("displays features based on the product name", () => {
    render(<SubscriptionCard product={mockProduct} />);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Feature 3")).toBeInTheDocument();
  });

  it("renders the PurchaseButton with correct props", () => {
    render(<SubscriptionCard product={mockProduct} />);
    const purchaseButton = screen.getByTestId("purchase-button-price_basic");
    expect(purchaseButton).toBeInTheDocument();
    expect(purchaseButton).toHaveTextContent(mockProduct.metadata.buttonText);
  });

  it('applies popular styling when metadata.popular is "true"', () => {
    const popularProduct = {
      ...mockProduct,
      metadata: { ...mockProduct.metadata, popular: "true" },
    };
    const { container } = render(<SubscriptionCard product={popularProduct} />);
    expect(container.firstChild).toHaveClass("border-4 border-primary");
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it('does not apply popular styling when metadata.popular is "false"', () => {
    const { container } = render(<SubscriptionCard product={mockProduct} />);
    expect(container.firstChild).not.toHaveClass("border-4 border-primary");
    expect(screen.queryByText("Popular")).not.toBeInTheDocument();
  });
});
