import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { emitEvent } from "@/lib/pusher";
import { isAdminAuthenticated } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const status = body?.status as OrderStatus | undefined;

  if (!status || !Object.values(OrderStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true
        }
      }
    }
  });

  if ((status === OrderStatus.SERVED || status === OrderStatus.CANCELLED) && order.tableId) {
    await prisma.table.update({
      where: { id: order.tableId },
      data: { status: "FREE" }
    });
  }

  await emitEvent(`restaurant-${order.restaurantId}`, "order_updated", order);

  return NextResponse.json({ order });
}
