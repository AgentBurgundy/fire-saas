export type StripeProductData = {
  id: string;
  active: boolean;
  description: string;
  images: string[];
  metadata: {
    firebaseRole: string;
    popular: string;
    buttonText: string;
  };
  name: string;
  role: string;
  tax_code: string;
};
