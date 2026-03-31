import { getRestaurant } from "@/lib/data";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdminSession();

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return <p>Restaurant data missing.</p>;
  }

  return <AdminSettingsClient restaurant={restaurant} />;
}
