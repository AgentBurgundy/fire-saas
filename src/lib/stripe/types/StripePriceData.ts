/**
 * Represents the data structure for a Stripe Price object.
 * This type is based on the Stripe API response for a Price, with some additional custom fields.
 */
export type StripePriceData = {
  /** Unique identifier for the price. */
  id: string;
  /** Whether the price can be used for new purchases. */
  active: boolean;
  /** Describes how the price will be computed when used in a subscription. */
  billing_scheme: "per_unit" | "tiered";
  /** Three-letter ISO currency code. */
  currency: string;
  /** An arbitrary string attached to the object. Often useful for displaying to users. */
  description: string | null;
  /** The frequency at which a subscription is billed. */
  interval: "day" | "week" | "month" | "year";
  /** The number of intervals between subscription billings. */
  interval_count: number;
  /** Set of key-value pairs that you can attach to an object. */
  metadata: Record<string, string>;
  /** The recurring components of a price such as `interval` and `interval_count`. */
  recurring: {
    /** Specifies a usage aggregation strategy for prices of `usage_type=metered`. */
    aggregate_usage: "sum" | "last_during_period" | "last_ever" | "max" | null;
    /** The frequency at which a subscription is billed. */
    interval: "day" | "week" | "month" | "year";
    /** The number of intervals between subscription billings. */
    interval_count: number;
    /** Configures how the quantity per period should be determined. */
    usage_type: "metered" | "licensed";
    /** Default number of trial days when subscribing a customer to this price using `trial_from_plan=true`. */
    trial_period_days: number | null;
  };
  /** Specifies whether the price is considered inclusive of taxes or exclusive of taxes. */
  tax_behavior: "inclusive" | "exclusive" | "unspecified";
  /** Each element represents a pricing tier. */
  tiers?: Array<{
    /** Price for the entire tier. */
    flat_amount: number | null;
    /** Per unit price for units relevant to the tier. */
    unit_amount: number | null;
    /** Up to and including to this quantity will be contained in the tier. */
    up_to: number | null;
  }>;
  /** Defines if the tiering price should be `graduated` or `volume` based. */
  tiers_mode: "graduated" | "volume" | null;
  /** Apply a transformation to the reported usage or set quantity before computing the billed price. */
  transform_quantity: {
    /** Divide usage by this number. */
    divide_by: number;
    /** After division, either round the result `up` or `down`. */
    round: "up" | "down";
  } | null;
  /** Default number of trial days when subscribing a customer to this price using `trial_from_plan=true`. */
  trial_period_days: number | null;
  /** One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase. */
  type: "one_time" | "recurring";
  /** The unit amount in cents to be charged, represented as a whole integer if possible. */
  unit_amount: number | null;
  /** The unit amount in cents to be charged, represented as a decimal string with at most 12 decimal places. */
  unit_amount_decimal: string | null;
  /** A formatted string of the price that can be shown to users. */
  formatted_price: string;
};
