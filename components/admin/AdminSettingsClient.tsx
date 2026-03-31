"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";

type Restaurant = {
  name: string;
  tagline: string | null;
  logo: string | null;
  currency: string;
  primaryColor: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  openingHours: string | null;
};

export function AdminSettingsClient({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();
  const [form, setForm] = useState<Restaurant>(restaurant);
  const [saving, setSaving] = useState(false);
  const fields: Array<{ key: keyof Restaurant; label: string }> = [
    { key: "name", label: "Restaurant name" },
    { key: "tagline", label: "Tagline" },
    { key: "logo", label: "Logo URL" },
    { key: "currency", label: "Currency" },
    { key: "primaryColor", label: "Primary color" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "openingHours", label: "Opening hours" }
  ];

  async function save() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
      <h1 className="text-3xl">Restaurant Settings</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map(({ key, label }) => (
          <label key={key} className="text-sm">
            <span className="mb-1 block text-app-text-muted">{label}</span>
            <input
              value={form[key] ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  [key]: event.target.value
                }))
              }
              className="min-h-11 w-full rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
            />
          </label>
        ))}
      </div>
      <Button className="mt-4" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save settings"}
      </Button>
    </section>
  );
}
