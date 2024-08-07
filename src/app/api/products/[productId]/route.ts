import { initializeAdmin } from "@/lib/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

const admin = initializeAdmin();

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    const productDoc = await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get active price doc from prices subcollection
    const pricesSnapshot = await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .collection("prices")
      .where("active", "==", true)
      .get();

    if (pricesSnapshot.empty) {
      return NextResponse.json(
        { error: "No active price found" },
        { status: 404 }
      );
    }

    const priceDoc = pricesSnapshot.docs[0];

    const priceInfo = {
      id: priceDoc.id,
      ...priceDoc.data(),
    };

    return NextResponse.json({ priceInfo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
