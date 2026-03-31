import Link from "next/link";
import { getRestaurant, getOrderSummary } from "@/lib/data";
import { requireAdminSession } from "@/lib/require-admin";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return <p>Restaurant data missing.</p>;
  }

  const summary = await getOrderSummary(restaurant.id);

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="accent-label text-[11px] text-app-primary">Dashboard</p>
          <h1 className="text-4xl">{restaurant.name}</h1>
        </div>
        <Link href="/admin/orders" className="text-sm text-app-primary">
          View all orders
        </Link>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Active Orders" value={String(summary.activeOrders)} />
        <StatsCard title="Tables Occupied" value={String(summary.tablesOccupied)} />
        <StatsCard title="Completed Today" value={String(summary.completedToday)} />
        <StatsCard
          title="Revenue Today"
          value={formatCurrency(summary.revenueToday, restaurant.currency)}
        />
      </div>

      <section className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
        <h2 className="text-2xl">Recent Orders</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {summary.recentOrders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-app-border p-3">
              <p>
                {order.orderType === "DELIVERY" ? "External Delivery" : `Table ${order.table?.number ?? "-"}`} ·{" "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
              </p>
              <p className="text-app-text-muted">{order.status.replaceAll("_", " ")}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
