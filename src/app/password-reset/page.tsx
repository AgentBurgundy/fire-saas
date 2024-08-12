"use client";

import PasswordResetForm from "@/components/auth/PasswordResetForm";
import { Suspense } from "react";

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordResetForm />
    </Suspense>
  );
}
