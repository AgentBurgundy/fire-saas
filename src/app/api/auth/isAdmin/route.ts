import { initializeAdmin } from "@/lib/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const admin = initializeAdmin();

export async function GET(req: NextRequest) {
  const searchParams = new URLSearchParams(req.nextUrl.search);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const isAdmin = userDoc.data()?.isAdmin === true;

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
