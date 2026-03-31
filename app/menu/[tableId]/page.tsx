import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { MenuClient } from "@/components/customer/MenuClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MenuPage({ params }: { params: { tableId: string } }) {
  const table = await prisma.table.findUnique({
    where: { id: params.tableId },
    include: { restaurant: true }
  });

  if (!table) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: { restaurantId: table.restaurantId },
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { restaurantId: table.restaurantId },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  return (
    <PageShell>
      <MenuClient
        tableId={table.id}
        tableNumber={table.number}
        mode="dine-in"
        restaurantName={table.restaurant.name}
        currency={table.restaurant.currency}
        categories={categories}
      />
    </PageShell>
  );
}
