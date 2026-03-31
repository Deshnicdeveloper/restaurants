"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";

type Category = {
  id: string;
  name: string;
};

export function MenuItemForm({
  categories,
  onCreated
}: {
  categories: Category[];
  onCreated: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [image, setImage] = useState("");

  async function submit() {
    if (!name || !price || !categoryId) {
      return;
    }

    await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        categoryId,
        image
      })
    });

    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    await onCreated();
  }

  return (
    <section className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
      <h2 className="text-2xl">Add menu item</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="min-h-11 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
        />
        <input
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Price"
          type="number"
          className="min-h-11 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          className="min-h-11 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
        />
        <input
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="Image URL or /public path"
          className="min-h-11 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
        />
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="min-h-11 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button onClick={submit}>Save item</Button>
      </div>
    </section>
  );
}
