"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import mixpanel from "mixpanel-browser";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./AuthContext";
import { Suspense } from "react";

export default function ClientProviders({ children }: any) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    debug: process.env.NODE_ENV !== "production",
    track_pageview: true,
    persistence: "localStorage",
  });

  return (
    <AuthProvider>
      <Toaster />
      {children}
      <Suspense fallback={<div></div>}>
        <ProgressBar
          height="4px"
          color="red"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </Suspense>
    </AuthProvider>
  );
}
