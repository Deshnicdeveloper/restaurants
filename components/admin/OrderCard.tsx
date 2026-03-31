"use client";

import { OrderStatus, OrderType } from "@prisma/client";
import { Clock3 } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { formatCurrency } from "@/lib/utils";

const statusBadge: Record<OrderStatus, "default" | "warning" | "success" | "danger"> = {
  PENDING: "warning",
  IN_PROGRESS: "default",
  SERVED: "success",
  CANCELLED: "danger"
};

type OrderPayload = {
  id: string;
  orderType: OrderType;
  status: OrderStatus;
  total: number;
  createdAt: string | Date;
  table: {
    number: number;
  } | null;
  customerName: string | null;
  customerPhone: string | null;
  deliveryAddress: string | null;
  note: string | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    menuItem: {
      name: string;
    };
  }[];
};

export function OrderCard({
  order,
  currency,
  onStatusChange
}: {
  order: OrderPayload;
  currency: string;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}) {
  const nextStatus =
    order.status === OrderStatus.PENDING
      ? OrderStatus.IN_PROGRESS
      : order.status === OrderStatus.IN_PROGRESS
        ? OrderStatus.SERVED
        : null;

  return (
    <article className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-semibold">
          {order.orderType === OrderType.DELIVERY
            ? `External Delivery${order.customerName ? ` • ${order.customerName}` : ""}`
            : `Table ${order.table?.number ?? "-"}`}
        </h3>
        <Badge variant={statusBadge[order.status]}>{order.status.replaceAll("_", " ")}</Badge>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-app-text-muted">
        <Clock3 className="h-3.5 w-3.5" />
        <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span>
              {item.quantity}x {item.menuItem.name}
            </span>
            <span className="text-app-text-muted">{formatCurrency(item.price * item.quantity, currency)}</span>
          </li>
        ))}
      </ul>

      {order.orderType === OrderType.DELIVERY ? (
        <div className="mt-3 space-y-1 rounded-xl border border-app-border p-3 text-xs text-app-text-muted">
          {order.customerPhone ? <p>Phone: {order.customerPhone}</p> : null}
          {order.deliveryAddress ? <p>Address: {order.deliveryAddress}</p> : null}
          {order.note ? <p>Note: {order.note}</p> : null}
        </div>
      ) : null}

      <div className="gold-divider my-3" />

      <div className="flex items-center justify-between text-sm">
        <span>Total</span>
        <span className="font-semibold text-app-primary">{formatCurrency(order.total, currency)}</span>
      </div>

      {nextStatus ? (
        <Button
          className="mt-4 w-full"
          variant={order.status === OrderStatus.PENDING ? "outline" : "primary"}
          onClick={() => onStatusChange(order.id, nextStatus)}
        >
          {nextStatus === OrderStatus.IN_PROGRESS ? "Mark In Progress" : "Mark Served"}
        </Button>
      ) : null}
    </article>
  );
}
