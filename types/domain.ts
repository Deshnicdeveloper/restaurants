import type { Category, MenuItem, Order, OrderItem, Restaurant, Review, Table } from "@prisma/client";

export type RestaurantWithReviews = Restaurant & { reviews: Review[] };

export type CategoryWithItems = Category & {
  items: MenuItem[];
};

export type OrderWithItems = Order & {
  table: Table | null;
  items: (OrderItem & {
    menuItem: MenuItem;
  })[];
};
