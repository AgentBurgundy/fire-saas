import { NextResponse } from "next/server";
import { getStripeServerSide } from "@/lib/stripe/getStripeServerSide";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const stripe = await getStripeServerSide();

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not initialized" },
        { status: 500 },
      );
    }

    const customer = await stripe.customers.create({
      email: email,
    });

    return NextResponse.json({ customerId: customer.id });
  } catch (error: any) {
    console.error("Error adding customer:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
