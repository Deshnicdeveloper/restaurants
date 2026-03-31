import Link from "next/link";
import { QrCode } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { Button } from "@/components/shared/Button";

export default function ScanTableQrPage() {
  return (
    <PageShell className="max-w-xl">
      <section className="safe-top mt-8 rounded-2xl border border-app-border bg-app-surface/80 p-6 text-center">
        <QrCode className="mx-auto h-10 w-10 text-app-primary" />
        <h1 className="mt-3 text-4xl">Scan Your Table QR</h1>
        <p className="mt-2 text-sm text-app-text-muted">
          For dine-in orders, please scan the QR code placed on your table so your order is sent to the correct table.
        </p>
        <div className="mt-5">
          <Link href="/">
            <Button variant="outline">Back Home</Button>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
