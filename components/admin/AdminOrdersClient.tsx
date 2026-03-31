"use client";

import { useMemo, useState } from "react";
import { OrderStatus } from "@prisma/client";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { OrderCard } from "@/components/admin/OrderCard";
import { Button } from "@/components/shared/Button";

type Order = {
  id: string;
  orderType: "DINE_IN" | "DELIVERY";
  status: OrderStatus;
  total: number;
  createdAt: string | Date;
  restaurantId: string;
  table: { number: number } | null;
  customerName: string | null;
  customerPhone: string | null;
  deliveryAddress: string | null;
  note: string | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    menuItem: { name: string };
  }[];
};

export function AdminOrdersClient({
  initialOrders,
  currency
}: {
  initialOrders: Order[];
  currency: string;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      return;
    }

    const restaurantId = initialOrders[0]?.restaurantId;
    if (!restaurantId) {
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    });

    const channel = pusher.subscribe(`restaurant-${restaurantId}`);
    channel.bind("new_order", (incoming: Order) => {
      setOrders((prev) => [incoming, ...prev]);
    });
    channel.bind("order_updated", (incoming: Order) => {
      setOrders((prev) => prev.map((order) => (order.id === incoming.id ? incoming : order)));
    });

    return () => {
      pusher.unsubscribe(`restaurant-${restaurantId}`);
      pusher.disconnect();
    };
  }, [initialOrders]);

  const filteredOrders = useMemo(() => {
    if (filter === "ALL") {
      return orders;
    }
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    setOrders((prev) => prev.map((order) => (order.id === orderId ? payload.order : order)));
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center gap-2">
        {(["ALL", "PENDING", "IN_PROGRESS", "SERVED"] as const).map((item) => (
          <Button
            key={item}
            variant={filter === item ? "primary" : "outline"}
            className="min-h-9 px-3 text-xs"
            onClick={() => setFilter(item)}
          >
            {item.replaceAll("_", " ")}
          </Button>
        ))}
      </header>

      <div className="grid gap-3 xl:grid-cols-2">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} currency={currency} onStatusChange={updateStatus} />
        ))}
      </div>
    </section>
  );
}
