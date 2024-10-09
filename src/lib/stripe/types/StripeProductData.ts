import { StripePriceData } from "./StripePriceData";

/**
 * Represents the data structure for a Stripe Product object.
 * This type is based on the Stripe API response for a Product, with some additional custom fields.
 */
export type StripeProductData = {
  /** Unique identifier for the product. */
  id: string;
  /** Whether the product is currently available for purchase. */
  active: boolean;
  /** The product's description, meant to be displayable to the customer. */
  description: string | null;
  /** A list of up to 8 URLs of images for this product, meant to be displayable to the customer. */
  images: string[];
  /** Set of key-value pairs that you can attach to an object. */
  metadata: {
    /** Custom field: The Firebase role associated with this product. */
    firebaseRole: string;
    /** Custom field: Indicates if this is a popular product. */
    popular: string;
    /** Custom field: Text to be displayed on the product's button. */
    buttonText: string;
    /** Any other custom metadata fields. */
    [key: string]: string;
  };
  /** The product's name, meant to be displayable to the customer. */
  name: string;
  /** The type of the product. The product is either a good or a service. */
  object: "product";
  /** Whether this product is shipped (i.e., physical goods). */
  shippable: boolean | null;
  /** Extra information about a product which will appear on your customer's credit card statement. */
  statement_descriptor: string | null;
  /** A label that represents units of this product, such as seat(s), license(s), or GB. */
  unit_label: string | null;
  /** Time at which the object was created. */
  created: number;
  /** Time at which the object was last updated. */
  updated: number;
  /** The URL of an associated package. */
  package_dimensions: {
    height: number;
    length: number;
    weight: number;
    width: number;
  } | null;
  /** A URL of a publicly-accessible webpage for this product. */
  url: string | null;
  /** Custom field: The role associated with this product. */
  role: string;
  /** A tax code ID. */
  tax_code: string | null;
  /** Optional price data associated with the product. */
  price: StripePriceData;
};
