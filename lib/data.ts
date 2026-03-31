import { OrderStatus } from "@prisma/client";
import { DEMO_RESTAURANT_ID } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function getRestaurant() {
  const restaurant = await prisma.restaurant.findFirst({
    where: { id: DEMO_RESTAURANT_ID },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });

  if (restaurant) {
    return restaurant;
  }

  return prisma.restaurant.findFirst({
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });
}

export async function getMenuForRestaurant(restaurantId?: string) {
  const restaurant = restaurantId
    ? await prisma.restaurant.findUnique({ where: { id: restaurantId } })
    : await getRestaurant();

  if (!restaurant) {
    return null;
  }

  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { restaurantId: restaurant.id },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  return { restaurant, categories };
}

export async function getTableById(tableId: string) {
  return prisma.table.findUnique({
    where: { id: tableId },
    include: { restaurant: true }
  });
}

export async function getOrderSummary(restaurantId: string) {
  const [activeOrders, completedToday, tablesOccupied, revenueResult, recentOrders] = await Promise.all([
    prisma.order.count({
      where: {
        restaurantId,
        status: { in: [OrderStatus.PENDING, OrderStatus.IN_PROGRESS] }
      }
    }),
    prisma.order.count({
      where: {
        restaurantId,
        status: OrderStatus.SERVED,
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.table.count({
      where: {
        restaurantId,
        status: "OCCUPIED"
      }
    }),
    prisma.order.aggregate({
      where: {
        restaurantId,
        status: OrderStatus.SERVED,
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      _sum: {
        total: true
      }
    }),
    prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        table: true,
        items: {
          include: {
            menuItem: true
          }
        }
      }
    })
  ]);

  return {
    activeOrders,
    completedToday,
    tablesOccupied,
    revenueToday: revenueResult._sum.total ?? 0,
    recentOrders
  };
}
