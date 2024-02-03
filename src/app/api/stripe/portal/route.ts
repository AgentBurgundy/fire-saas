import { initializeAdmin } from "@/lib/firebase/firebaseAdmin";
import { getStripeServerSide } from "@/lib/stripe/getStripeServerSide";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const admin = initializeAdmin();

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const uid = cookieStore.get("uid")?.value;
    if (!uid)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const stripe = await getStripeServerSide();
    if (!stripe)
      return NextResponse.json({ error: "Stripe not found" }, { status: 404 });

    const customer_id = await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => doc.data()?.stripeId);

    if (!customer_id)
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );

    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
