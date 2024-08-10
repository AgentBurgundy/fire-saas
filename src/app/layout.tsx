import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/lib/context/ClientProviders";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/nav/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FireSaaS",
  description:
    "FireSaaS helps you build your SaaS faster and easier using NextJS, Firebase and Stripe!",
  metadataBase: new URL("https://firesaas.dev"),
  openGraph: {
    title: "FireSaaS",
    description:
      "FireSaaS helps you build your SaaS faster and easier using NextJS, Firebase and Stripe!",
    url: "https://firesaas.dev",
    siteName: "FireSaaS",
  },
  twitter: {
    card: "summary_large_image",
    title: "FireSaaS",
    description:
      "FireSaaS helps you build your SaaS faster and easier using NextJS, Firebase and Stripe!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Change your theme HERE */}
      <body className={inter.className} data-theme="cupcake">
        <ClientProviders>
          <Navbar />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
