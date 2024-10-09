import { initializeAdmin } from "@/lib/firebase/firebaseAdmin";
import { getStripeServerSide } from "@/lib/stripe/getStripeServerSide";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const admin = initializeAdmin();

export async function GET(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe secret key not found" },
      { status: 500 },
    );
  }

  const cookieStore = cookies();
  const uid = cookieStore.get("uid")?.value;
  if (!uid)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const customerId = await admin
    .firestore()
    .collection("users")
    .doc(uid)
    .get()
    .then((doc) => doc.data()?.stripeId);

  const stripe = await getStripeServerSide();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not initialized" },
      { status: 500 },
    );
  }

  const customerSession = await stripe.customerSessions.create({
    customer: customerId,
    components: {
      pricing_table: {
        enabled: true,
      },
    },
  });

  return NextResponse.json({ clientSecret: customerSession.client_secret });
}
