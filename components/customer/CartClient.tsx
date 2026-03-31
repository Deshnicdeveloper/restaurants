"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartClient({
  mode,
  currency,
  tableId,
  tableNumber
}: {
  mode: "dine-in" | "delivery";
  currency: string;
  tableId?: string;
  tableNumber?: number;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const items = useCartStore((state) => state.items);
  const note = useCartStore((state) => state.note);
  const setNote = useCartStore((state) => state.setNote);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  async function submitOrder() {
    if (mode === "delivery" && (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim())) {
      alert("Please add your name, phone number, and delivery address.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderType: mode === "delivery" ? "DELIVERY" : "DINE_IN",
          tableId: mode === "dine-in" ? tableId : undefined,
          note,
          customerName: mode === "delivery" ? customerName : undefined,
          customerPhone: mode === "delivery" ? customerPhone : undefined,
          deliveryAddress: mode === "delivery" ? deliveryAddress : undefined,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Unable to place order");
      }

      const payload = await response.json();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      clear();
      if (mode === "delivery") {
        router.push(`/menu/external/confirmation?orderId=${payload.order.id}&items=${count}`);
      } else {
        router.push(`/menu/${tableId}/confirmation?orderId=${payload.order.id}&items=${count}`);
      }
    } catch (error) {
      console.error(error);
      alert("Could not place order right now. Please try again.");
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto mt-12 max-w-md rounded-2xl border border-app-border bg-app-surface/70 p-6 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-app-text-muted">Add dishes from the menu to continue.</p>
        <Button className="mt-5" onClick={() => router.push(mode === "delivery" ? "/menu/external" : `/menu/${tableId}`)}>
          Back to menu
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-4">
        <header>
          <p className="accent-label text-[11px] text-app-primary">
            {mode === "delivery" ? "External Delivery" : `Table ${tableNumber ?? "-"}`}
          </p>
          <h1 className="text-4xl">Order Review</h1>
        </header>

        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.menuItemId}
              className="flex items-center gap-3 rounded-2xl border border-app-border bg-app-surface/80 p-3"
            >
              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-app-text-muted">{formatCurrency(item.price, currency)}</p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-app-border px-2 py-1">
                <button type="button" onClick={() => setQuantity(item.menuItemId, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-4 text-center text-sm">{item.quantity}</span>
                <button type="button" onClick={() => setQuantity(item.menuItemId, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                className="rounded-full p-2 text-app-danger hover:bg-app-danger/10"
                onClick={() => removeItem(item.menuItemId)}
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        {mode === "delivery" ? (
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Your full name"
              className="min-h-11 rounded-xl border border-app-border bg-app-surface px-3 text-sm outline-none focus:border-app-primary"
            />
            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="Phone number"
              className="min-h-11 rounded-xl border border-app-border bg-app-surface px-3 text-sm outline-none focus:border-app-primary"
            />
            <input
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              placeholder="Delivery address"
              className="min-h-11 rounded-xl border border-app-border bg-app-surface px-3 text-sm outline-none focus:border-app-primary md:col-span-2"
            />
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="note">
            Special instructions (optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="min-h-24 w-full rounded-xl border border-app-border bg-app-surface p-3 text-sm outline-none focus:border-app-primary"
            placeholder="No onions, extra spicy, allergy notes..."
          />
        </div>

        <footer className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-app-text-muted">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() => setShowConfirm(true)}
            disabled={submitting || items.length === 0}
          >
            {submitting ? "Submitting..." : "Place Order"}
          </Button>
        </footer>
      </section>

      <Modal
        open={showConfirm}
        title="Confirm order"
        onClose={() => setShowConfirm(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={submitOrder} disabled={submitting}>
              Confirm
            </Button>
          </>
        }
      >
        {mode === "delivery"
          ? "You are placing an external delivery order. Continue?"
          : `You are sending this order to the kitchen for Table ${tableNumber}. Continue?`}
      </Modal>
    </>
  );
}
