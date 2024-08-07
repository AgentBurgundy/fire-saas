import { initializeAdmin } from "@/lib/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

const admin = initializeAdmin();

export async function POST(req: NextRequest) {
  try {
    const { uid, secretCode, name, email } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Check if the user document already exists
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

    if (!userDoc.exists) {
      // Create a new user document in Firestore
      await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .set(
          {
            name: name || "",
            email: email || "",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          {
            merge: true,
          }
        );

      // Set custom claims for the user
      await admin.auth().setCustomUserClaims(uid, {
        stripeRole: "Free",
      });

      // If a secret code is provided, you can handle it here
      if (secretCode) {
        // Implement secret code logic here if needed
      }

      return NextResponse.json({
        message: "User document created successfully",
      });
    } else {
      return NextResponse.json({ message: "User document already exists" });
    }
  } catch (error: any) {
    console.error("Error creating user document:", error);
    return NextResponse.json(
      { error: "Failed to create user document" },
      { status: 500 }
    );
  }
}
