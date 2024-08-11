import AdminDashboard from "@/components/admin/AdminDashboard";
import Page from "@/components/shared/Page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const cookieStore = cookies();
  const uid = cookieStore.get("uid")?.value;

  const isAdminResponse = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL! + "/api/auth/isAdmin?uid=" + uid
  );

  const { isAdmin } = await isAdminResponse.json();

  if (!isAdmin) {
    redirect("/app/dashboard");
  }

  return (
    <Page>
      <AdminDashboard />
    </Page>
  );
}
