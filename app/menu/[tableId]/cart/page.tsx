import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { CartClient } from "@/components/customer/CartClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CartPage({ params }: { params: { tableId: string } }) {
  const table = await prisma.table.findUnique({
    where: { id: params.tableId },
    include: { restaurant: true }
  });

  if (!table) {
    notFound();
  }

  return (
    <PageShell>
      <CartClient mode="dine-in" tableId={table.id} tableNumber={table.number} currency={table.restaurant.currency} />
    </PageShell>
  );
}
