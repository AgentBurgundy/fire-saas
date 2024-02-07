import ManageAccount from "@/components/settings/ManageAccount";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import fetchStripeProducts from "@/lib/server/fetchStripeProducts";

export default async function SettingsPage() {
  const { products } = await fetchStripeProducts();

  return (
    <main className="flex min-h-screen flex-col space-y-10 pb-10 items-center justify-start lg:p-4">
      <span>Settings</span>

      <ManageAccount />

      {products && <SubscriptionModal products={products} />}
    </main>
  );
}
