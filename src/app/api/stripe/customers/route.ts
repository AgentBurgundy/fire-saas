import { NextResponse } from "next/server";
import { getStripeServerSide } from "@/lib/stripe/getStripeServerSide";

export async function GET() {
  try {
    const stripe = await getStripeServerSide();

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not initialized" },
        { status: 500 },
      );
    }
    const customers = await stripe.customers.list({ limit: 100 });

    const formattedCustomers = customers.data.map((customer) => ({
      id: customer.id,
      email: customer.email,
    }));

    return NextResponse.json({ customers: formattedCustomers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
