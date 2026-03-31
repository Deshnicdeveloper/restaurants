import { PageShell } from "@/components/shared/PageShell";
import { CartClient } from "@/components/customer/CartClient";
import { getRestaurant } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ExternalCartPage() {
  const restaurant = await getRestaurant();

  if (!restaurant) {
    return <PageShell><p>Restaurant data missing.</p></PageShell>;
  }

  return (
    <PageShell>
      <CartClient mode="delivery" currency={restaurant.currency} />
    </PageShell>
  );
}
