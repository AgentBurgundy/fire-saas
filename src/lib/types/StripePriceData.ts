export type StripePriceData = {
  id: string;
  active: boolean;
  billing_scheme: string;
  currency: string;
  description: string;
  interval: string;
  interval_count: number;
  metadata: {
    [key: string]: string;
  };
  recurring: {
    aggregate_usage: string;
    interval: string;
    interval_count: number;
    usage_type: string;
    trial_period_days: number;
  };
  tax_behavior: string;
  tiers: {
    flat_amount: number;
    unit_amount: number;
  }[];

  tiers_mode: string;
  transform_quantity: string;
  trial_period_days: number;
  type: string;
  unit_amount: number;
  formatted_price: string;
};
