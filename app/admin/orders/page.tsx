import { prisma } from "@/lib/prisma";
import { getRestaurant } from "@/lib/data";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdminSession();

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return <p>Restaurant data missing.</p>;
  }

  const orders = await prisma.order.findMany({
    where: { restaurantId: restaurant.id },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="space-y-4">
      <header>
        <p className="accent-label text-[11px] text-app-primary">Admin</p>
        <h1 className="text-4xl">Orders</h1>
      </header>
      <AdminOrdersClient initialOrders={orders} currency={restaurant.currency} />
    </section>
  );
}
