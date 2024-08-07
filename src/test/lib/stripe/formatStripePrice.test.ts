import formatStripeAmount from "@/lib/stripe/formatStripePrice";

describe("formatStripeAmount", () => {
  it("formats USD amount correctly", () => {
    expect(formatStripeAmount(1000)).toBe("$10.00");
    expect(formatStripeAmount(1050)).toBe("$10.50");
    expect(formatStripeAmount(100)).toBe("$1.00");
    expect(formatStripeAmount(99)).toBe("$0.99");
  });

  it("formats zero amount correctly", () => {
    expect(formatStripeAmount(0)).toBe("$0.00");
  });

  it("formats large amounts correctly", () => {
    expect(formatStripeAmount(100000)).toBe("$1,000.00");
    expect(formatStripeAmount(1000000)).toBe("$10,000.00");
  });

  it("formats EUR amount correctly", () => {
    expect(formatStripeAmount(1000, "eur")).toBe("€10.00");
    expect(formatStripeAmount(1050, "eur")).toBe("€10.50");
  });

  it("formats GBP amount correctly", () => {
    expect(formatStripeAmount(1000, "gbp")).toBe("£10.00");
    expect(formatStripeAmount(1050, "gbp")).toBe("£10.50");
  });

  it("formats JPY amount correctly", () => {
    expect(formatStripeAmount(100000, "jpy")).toBe("¥1,000");
    expect(formatStripeAmount(105000, "jpy")).toBe("¥1,050");
  });

  it("handles fractional cents correctly", () => {
    expect(formatStripeAmount(1000.5)).toBe("$10.01");
    expect(formatStripeAmount(1000.4)).toBe("$10.00");
  });

  it("handles negative amounts correctly", () => {
    expect(formatStripeAmount(-1000)).toBe("-$10.00");
    expect(formatStripeAmount(-1050)).toBe("-$10.50");
  });
});
