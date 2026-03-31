"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/shared/Button";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { formatCurrency } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    available: boolean;
  }[];
};

export function AdminMenuClient({
  initialCategories,
  currency
}: {
  initialCategories: Category[];
  currency: string;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [categoryName, setCategoryName] = useState("");

  const flatItems = useMemo(
    () => categories.flatMap((category) => category.items.map((item) => ({ ...item, categoryName: category.name }))),
    [categories]
  );

  async function reload() {
    const response = await fetch("/api/menu", { cache: "no-store" });
    const payload = await response.json();
    setCategories(payload.categories);
  }

  async function addCategory() {
    if (!categoryName.trim()) {
      return;
    }

    await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: categoryName })
    });

    setCategoryName("");
    await reload();
  }

  return (
    <section className="space-y-4">
      <section className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
        <h2 className="text-2xl">Add category</h2>
        <div className="mt-3 flex gap-2">
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Category name"
            className="min-h-11 flex-1 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
          />
          <Button onClick={addCategory}>Save</Button>
        </div>
      </section>

      <MenuItemForm
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        onCreated={reload}
      />

      <section className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
        <h2 className="text-2xl">Menu items</h2>
        <ul className="mt-4 space-y-2">
          {flatItems.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-app-border p-3 text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-app-text-muted">{item.categoryName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-app-primary">{formatCurrency(item.price, currency)}</span>
                <Button
                  variant={item.available ? "outline" : "primary"}
                  className="min-h-9 px-3 text-xs"
                  onClick={async () => {
                    await fetch("/api/menu", {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ id: item.id, available: !item.available })
                    });
                    await reload();
                  }}
                >
                  {item.available ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="danger"
                  className="min-h-9 px-3 text-xs"
                  onClick={async () => {
                    await fetch(`/api/menu?id=${item.id}`, { method: "DELETE" });
                    await reload();
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
