import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/Button";

export function OrderConfirmation({
  mode,
  tableNumber,
  itemsCount,
  backHref
}: {
  mode: "dine-in" | "delivery";
  tableNumber?: number;
  itemsCount: number;
  backHref: string;
}) {
  return (
    <section className="mx-auto mt-10 max-w-md rounded-2xl border border-app-border bg-app-surface/80 p-6 text-center shadow-gold">
      <CheckCircle2 className="mx-auto h-12 w-12 text-app-success" />
      <h1 className="mt-4 text-3xl font-semibold">Order Sent</h1>
      <p className="mt-2 text-sm text-app-text-muted">
        {mode === "delivery"
          ? "Your delivery order has been received. We will contact you shortly to confirm dispatch."
          : `Your order has been sent to the kitchen. A staff member will serve Table ${tableNumber} shortly.`}
      </p>
      <p className="mt-3 text-xs text-app-text-muted">{itemsCount} item(s) submitted successfully.</p>
      <div className="mt-6 flex flex-col gap-2">
        <Link href={backHref}>
          <Button className="w-full">Back to menu</Button>
        </Link>
      </div>
    </section>
  );
}
