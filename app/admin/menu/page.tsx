import { prisma } from "@/lib/prisma";
import { getRestaurant } from "@/lib/data";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminMenuClient } from "@/components/admin/AdminMenuClient";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  await requireAdminSession();

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return <p>Restaurant data missing.</p>;
  }

  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { restaurantId: restaurant.id },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  return (
    <section className="space-y-4">
      <header>
        <p className="accent-label text-[11px] text-app-primary">Admin</p>
        <h1 className="text-4xl">Menu Management</h1>
      </header>
      <AdminMenuClient initialCategories={categories} currency={restaurant.currency} />
    </section>
  );
}
