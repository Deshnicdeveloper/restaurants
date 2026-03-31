import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { OrderConfirmation } from "@/components/customer/OrderConfirmation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
  searchParams
}: {
  params: { tableId: string };
  searchParams: { items?: string };
}) {
  const table = await prisma.table.findUnique({ where: { id: params.tableId } });

  if (!table) {
    notFound();
  }

  return (
    <PageShell>
      <OrderConfirmation
        mode="dine-in"
        tableNumber={table.number}
        itemsCount={Number(searchParams.items ?? 0)}
        backHref={`/menu/${table.id}`}
      />
    </PageShell>
  );
}
