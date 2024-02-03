import { initializeAdmin } from "@/lib/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

const admin = initializeAdmin();

export async function GET() {
  try {
    const productSnapshot = await admin
      .firestore()
      .collection("products")
      .where("active", "==", true)
      .get();

    const products = productSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
