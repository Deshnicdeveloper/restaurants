"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { formatCurrency } from "@/lib/utils";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  available: boolean;
};

export function MenuItemCard({
  item,
  currency,
  quantity,
  onIncrease,
  onDecrease
}: {
  item: MenuItem;
  currency: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-app-border bg-app-surface/80 transition hover:-translate-y-0.5 hover:border-app-primary/50">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={item.image || "/images/food-placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-app-bg/50 to-transparent" />
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-app-text-muted">
            {item.description || "Chef-crafted detail arriving table-side."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-app-primary">{formatCurrency(item.price, currency)}</p>
          {!item.available ? (
            <span className="rounded-full border border-app-danger/30 bg-app-danger/10 px-2.5 py-1 text-xs font-semibold text-app-danger">
              Sold out
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-2 rounded-full border border-app-border px-2 py-1">
              <button
                type="button"
                onClick={onDecrease}
                className="rounded-full p-1 text-app-text-muted hover:bg-white/5 hover:text-app-text"
                aria-label={`Decrease ${item.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-5 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={onIncrease}
                className="rounded-full p-1 text-app-text-muted hover:bg-white/5 hover:text-app-text"
                aria-label={`Increase ${item.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              onClick={onIncrease}
              className="min-h-9 rounded-full px-4 text-xs"
            >
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
