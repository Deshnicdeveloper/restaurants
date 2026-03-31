import Link from "next/link";
import { PageShell } from "@/components/shared/PageShell";
import { Button } from "@/components/shared/Button";

export default function OrderEntryPage() {
  return (
    <PageShell className="max-w-3xl">
      <section className="safe-top mt-8 rounded-2xl border border-app-border bg-app-surface/80 p-6 md:p-8">
        <p className="accent-label text-[11px] text-app-primary">Start Order</p>
        <h1 className="mt-2 text-4xl">Are You In The Restaurant?</h1>
        <p className="mt-2 text-sm text-app-text-muted">
          Choose your order mode to continue.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border border-app-border bg-app-bg/50 p-4">
            <h2 className="text-2xl">Yes, I am in</h2>
            <p className="mt-2 text-sm text-app-text-muted">
              Scan the table QR so your order goes directly to your table.
            </p>
            <Link href="/menu/scan" className="mt-4 inline-block">
              <Button>Scan Table QR</Button>
            </Link>
          </article>

          <article className="rounded-2xl border border-app-border bg-app-bg/50 p-4">
            <h2 className="text-2xl">No, external delivery</h2>
            <p className="mt-2 text-sm text-app-text-muted">
              Continue to menu. At checkout, add your phone and delivery address.
            </p>
            <Link href="/menu/external" className="mt-4 inline-block">
              <Button>Order Delivery</Button>
            </Link>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
