import { PageShell } from "@/components/shared/PageShell";
import { OrderConfirmation } from "@/components/customer/OrderConfirmation";

export const dynamic = "force-dynamic";

export default function ExternalConfirmationPage({
  searchParams
}: {
  searchParams: { items?: string };
}) {
  return (
    <PageShell>
      <OrderConfirmation
        mode="delivery"
        itemsCount={Number(searchParams.items ?? 0)}
        backHref="/menu/external"
      />
    </PageShell>
  );
}
