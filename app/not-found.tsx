import Link from "next/link";
import { PageShell } from "@/components/shared/PageShell";
import { Button } from "@/components/shared/Button";

export default function NotFound() {
  return (
    <PageShell className="flex min-h-[60vh] items-center justify-center">
      <section className="w-full max-w-md rounded-2xl border border-app-border bg-app-surface/80 p-6 text-center">
        <p className="accent-label text-[11px] text-app-primary">404</p>
        <h1 className="mt-2 text-4xl">Page not found</h1>
        <p className="mt-2 text-sm text-app-text-muted">This table or page may no longer exist.</p>
        <Link href="/" className="mt-5 inline-block">
          <Button>Back home</Button>
        </Link>
      </section>
    </PageShell>
  );
}
