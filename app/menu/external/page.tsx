import { PageShell } from "@/components/shared/PageShell";
import { MenuClient } from "@/components/customer/MenuClient";
import { getRestaurant } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ExternalMenuPage() {
  const restaurant = await getRestaurant();

  if (!restaurant) {
    return <PageShell><p>Restaurant data missing.</p></PageShell>;
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

  return (
    <PageShell>
      <MenuClient
        tableId="external"
        mode="browse"
        restaurantName={restaurant.name}
        currency={restaurant.currency}
        categories={categories}
      />
    </PageShell>
  );
}
