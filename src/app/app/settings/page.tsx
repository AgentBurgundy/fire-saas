import ManageAccount from "@/components/settings/ManageAccount";

export default async function SettingsPage() {
  return (
    <main className="flex min-h-screen flex-col space-y-10 pb-10 items-center justify-start lg:p-4">
      <span>Settings</span>

      <ManageAccount />
    </main>
  );
}
