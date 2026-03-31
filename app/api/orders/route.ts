import { NextResponse } from "next/server";
import { OrderStatus, OrderType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { emitEvent } from "@/lib/pusher";
import { getRestaurant } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET(request: Request) {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as OrderStatus | null;

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await prisma.order.findMany({
    where: {
      restaurantId: restaurant.id,
      ...(status ? { status } : {})
    },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const tableId = body?.tableId as string | undefined;
  const requestedOrderType = body?.orderType as OrderType | undefined;
  const orderType =
    requestedOrderType && Object.values(OrderType).includes(requestedOrderType)
      ? requestedOrderType
      : OrderType.DINE_IN;
  const note = body?.note as string | undefined;
  const customerName = body?.customerName as string | undefined;
  const customerPhone = body?.customerPhone as string | undefined;
  const deliveryAddress = body?.deliveryAddress as string | undefined;
  const items = body?.items as { menuItemId: string; quantity: number }[] | undefined;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }

  if (orderType === OrderType.DINE_IN && !tableId) {
    return NextResponse.json({ error: "Table is required for dine-in orders" }, { status: 400 });
  }

  if (
    orderType === OrderType.DELIVERY &&
    (!customerName?.trim() || !customerPhone?.trim() || !deliveryAddress?.trim())
  ) {
    return NextResponse.json(
      { error: "Customer name, phone, and delivery address are required for delivery" },
      { status: 400 }
    );
  }

  const table =
    orderType === OrderType.DINE_IN
      ? await prisma.table.findUnique({
          where: { id: tableId! },
          include: { restaurant: true }
        })
      : null;

  if (orderType === OrderType.DINE_IN && !table) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  const restaurantId =
    orderType === OrderType.DINE_IN
      ? table!.restaurantId
      : (await getRestaurant())?.id;

  if (!restaurantId) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: items.map((item) => item.menuItemId) },
      restaurantId,
      available: true
    }
  });

  if (menuItems.length !== items.length) {
    return NextResponse.json(
      {
        error: "Some menu items are unavailable"
      },
      { status: 400 }
    );
  }

  const total = items.reduce((sum, item) => {
    const menuItem = menuItems.find((candidate) => candidate.id === item.menuItemId);
    return sum + (menuItem?.price ?? 0) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      tableId: orderType === OrderType.DINE_IN ? tableId : null,
      restaurantId,
      orderType,
      customerName: orderType === OrderType.DELIVERY ? customerName?.trim() : null,
      customerPhone: orderType === OrderType.DELIVERY ? customerPhone?.trim() : null,
      deliveryAddress: orderType === OrderType.DELIVERY ? deliveryAddress?.trim() : null,
      note: note?.trim() || null,
      total,
      status: OrderStatus.PENDING,
      items: {
        create: items.map((item) => {
          const menuItem = menuItems.find((candidate) => candidate.id === item.menuItemId);
          return {
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: menuItem?.price ?? 0
          };
        })
      }
    },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true
        }
      }
    }
  });

  if (orderType === OrderType.DINE_IN && table) {
    await prisma.table.update({
      where: { id: table.id },
      data: { status: "OCCUPIED" }
    });
  }

  await emitEvent(`restaurant-${restaurantId}`, "new_order", order);

  return NextResponse.json({ order }, { status: 201 });
}
