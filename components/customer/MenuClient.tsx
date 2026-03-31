"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Home, MenuSquare, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/shared/BottomNav";
import { CategoryTabs } from "@/components/customer/CategoryTabs";
import { MenuItemCard } from "@/components/customer/MenuItemCard";
import { CartFab } from "@/components/customer/CartFab";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { useCartStore } from "@/lib/cart-store";

type CategoryData = {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    available: boolean;
  }[];
};

export function MenuClient({
  tableId,
  tableNumber,
  mode,
  restaurantName,
  currency,
  categories
}: {
  tableId: string;
  tableNumber?: number;
  mode: "dine-in" | "browse";
  restaurantName: string;
  currency: string;
  categories: CategoryData[];
}) {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const setTableId = useCartStore((state) => state.setTableId);
  const orderMode = useCartStore((state) => state.orderMode);
  const setOrderMode = useCartStore((state) => state.setOrderMode);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "");
  const [showModePrompt, setShowModePrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState<Omit<
    { menuItemId: string; name: string; price: number; image?: string | null },
    never
  > | null>(null);

  useEffect(() => {
    if (mode === "dine-in") {
      setOrderMode("dine-in");
      setTableId(tableId);
    } else {
      if (!(orderMode === "delivery" && cartItems.length > 0)) {
        setOrderMode("unknown");
      }
      setTableId("external");
    }
  }, [cartItems.length, mode, orderMode, setOrderMode, setTableId, tableId]);

  const sections = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id,
        name: category.name
      })),
    [categories]
  );

  const menuHref = mode === "browse" ? "/menu/external" : `/menu/${tableId}`;
  const cartHref = mode === "browse" ? "/menu/external/cart" : `/menu/${tableId}/cart`;

  const activeCategoryData = categories.find((category) => category.id === activeCategory) ?? categories[0];

  function increaseItem(item: CategoryData["items"][number]) {
    const cartPayload = {
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    };

    if (mode === "dine-in") {
      addItem(cartPayload);
      return;
    }

    if (orderMode === "delivery") {
      addItem(cartPayload);
      return;
    }

    setPendingItem(cartPayload);
    setShowModePrompt(true);
  }

  function decreaseItem(item: CategoryData["items"][number]) {
    const current = cartItems.find((cartItem) => cartItem.menuItemId === item.id)?.quantity ?? 0;
    setQuantity(item.id, current - 1);
  }

  return (
    <>
      <header className="safe-top space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-app-border px-3 text-sm text-app-text-muted hover:text-app-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>
          <span className="accent-label text-[11px] text-app-text-muted">
            {mode === "browse" ? "Public Menu" : `Table ${tableNumber ?? "-"}`}
          </span>
        </div>

        <div>
          <p className="accent-label text-[11px] text-app-primary">{mode === "dine-in" ? "Scan • Tap • Dine" : "Browse • Choose • Continue"}</p>
          <h1 className="text-4xl leading-tight">{restaurantName}</h1>
          <p className="mt-1 text-sm text-app-text-muted">
            {mode === "dine-in"
              ? "Select your dishes and send your order directly to the kitchen."
              : "Browse the menu. On first add-to-cart, we’ll ask if you are dining in or ordering for delivery."}
          </p>
        </div>

        <CategoryTabs
          categories={sections}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </header>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">{activeCategoryData?.name}</h2>
          <span className="text-xs text-app-text-muted">{activeCategoryData?.items.length ?? 0} item(s)</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(activeCategoryData?.items ?? []).map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              currency={currency}
              quantity={cartItems.find((cartItem) => cartItem.menuItemId === item.id)?.quantity ?? 0}
              onIncrease={() => increaseItem(item)}
              onDecrease={() => decreaseItem(item)}
            />
          ))}
        </div>
      </div>

      <CartFab href={cartHref} currency={currency} />

      <BottomNav
        items={[
          { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
          { href: menuHref, label: "Menu", icon: <MenuSquare className="h-4 w-4" /> },
          { href: cartHref, label: "Cart", icon: <ShoppingCart className="h-4 w-4" /> }
        ]}
      />

      <Modal
        open={showModePrompt}
        title="Are you in the restaurant?"
        onClose={() => setShowModePrompt(false)}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowModePrompt(false);
                router.push("/menu/scan");
              }}
            >
              Yes, I am in
            </Button>
            <Button
              onClick={() => {
                setOrderMode("delivery");
                if (pendingItem) {
                  addItem(pendingItem);
                }
                setPendingItem(null);
                setShowModePrompt(false);
              }}
            >
              No, delivery
            </Button>
          </>
        }
      >
        Dine-in orders must come from your table QR. If you are not in the restaurant, continue as delivery.
      </Modal>
    </>
  );
}
