import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StripePricingTable from "@/components/subscription/StripePricingTable";
import { useAuth } from "@/lib/context/AuthContext";

jest.mock("../../../lib/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ clientSecret: "mock_client_secret" }),
  })
) as jest.Mock;

describe("StripePricingTable", () => {
  const mockProps = {
    pricingTableId: "prctbl_1234567890",
    publishableKey: "pk_test_abcdefghijklmnop",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a message when user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<StripePricingTable {...mockProps} />);
    expect(
      screen.getByText("Please sign in to show embedded pricing table")
    ).toBeInTheDocument();
  });

  it("renders the Stripe pricing table when user is authenticated", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: "123" },
    });

    render(<StripePricingTable {...mockProps} />);

    await waitFor(() => {
      const pricingTable = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === "stripe-pricing-table";
      });
      expect(pricingTable).toBeInTheDocument();
      expect(pricingTable).toHaveAttribute(
        "pricing-table-id",
        mockProps.pricingTableId
      );
      expect(pricingTable).toHaveAttribute(
        "publishable-key",
        mockProps.publishableKey
      );
      expect(pricingTable).toHaveAttribute("client-reference-id", "123");
      expect(pricingTable).toHaveAttribute(
        "customer-session-client-secret",
        "mock_client_secret"
      );
    });
  });

  it("loads the Stripe script when component mounts", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: "123" },
    });

    render(<StripePricingTable {...mockProps} />);

    await waitFor(() => {
      const script = document.querySelector(
        'script[src="https://js.stripe.com/v3/pricing-table.js"]'
      );
      expect(script).toBeInTheDocument();
    });
  });

  it("removes the Stripe script when component unmounts", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: "123" },
    });

    const { unmount } = render(<StripePricingTable {...mockProps} />);

    await waitFor(() => {
      const script = document.querySelector(
        'script[src="https://js.stripe.com/v3/pricing-table.js"]'
      );
      expect(script).toBeInTheDocument();
    });

    unmount();

    await waitFor(() => {
      const script = document.querySelector(
        'script[src="https://js.stripe.com/v3/pricing-table.js"]'
      );
      expect(script).not.toBeInTheDocument();
    });
  });

  it("handles error when fetching customer session fails", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: "123" },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })
    ) as jest.Mock;

    console.error = jest.fn();

    render(<StripePricingTable {...mockProps} />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching customer session:",
        expect.any(Error)
      );
    });
  });
});
