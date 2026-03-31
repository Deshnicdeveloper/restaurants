import { prisma } from "@/lib/prisma";
import { getRestaurant } from "@/lib/data";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminTablesClient } from "@/components/admin/AdminTablesClient";

export const dynamic = "force-dynamic";

export default async function AdminTablesPage() {
  await requireAdminSession();

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return <p>Restaurant data missing.</p>;
  }

  const tables = await prisma.table.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { number: "asc" }
  });

  return (
    <section className="space-y-4">
      <header>
        <p className="accent-label text-[11px] text-app-primary">Admin</p>
        <h1 className="text-4xl">Tables</h1>
      </header>
      <AdminTablesClient initialTables={tables} />
    </section>
  );
}
