"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartTotals } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartFab({ href, currency }: { href: string; currency: string }) {
  const { count, total } = useCartTotals();

  if (count === 0) {
    return null;
  }

  return (
    <Link
      href={href}
      className="safe-bottom fixed bottom-4 right-4 z-30 flex min-h-11 items-center gap-3 rounded-full bg-app-primary px-4 py-2 text-sm font-semibold text-app-bg shadow-gold"
    >
      <ShoppingBag className="h-4 w-4" />
      <span>{count} item(s)</span>
      <span className="rounded-full bg-app-bg/10 px-2 py-0.5">{formatCurrency(total, currency)}</span>
    </Link>
  );
}
