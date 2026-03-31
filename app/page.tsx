import Link from "next/link";
import Image from "next/image";
import { Clock3, MapPin, Phone, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getRestaurant } from "@/lib/data";
import { PageShell } from "@/components/shared/PageShell";
import { Button } from "@/components/shared/Button";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ambienceGallery = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    title: "Signature Dining Hall",
    description: "Warm lighting, curated seating, and an intimate fine dining atmosphere."
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    title: "Chef’s Service",
    description: "Precision plating and attentive table-side presentation."
  },
  {
    src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
    title: "Evening Mood",
    description: "Elegant late-night ambiance crafted for memorable moments."
  }
] as const;

export default async function HomePage() {
  const restaurant = await getRestaurant();

  const featuredItems = restaurant
    ? await prisma.menuItem.findMany({
        where: { restaurantId: restaurant.id, available: true },
        orderBy: { createdAt: "asc" },
        take: 6
      })
    : [];

  const reviews = (restaurant?.reviews ?? []).slice(0, 3);

  return (
    <PageShell className="pb-20">
      <section className="safe-top -mx-4 overflow-hidden border-y border-app-border bg-app-surface md:mx-0 md:rounded-3xl md:border">
        <div className="relative min-h-[78svh]">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
            alt="Luxury restaurant interior"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-app-bg via-app-bg/70 to-app-bg/30" />

          <div className="relative flex min-h-[78svh] items-end p-6 md:p-10">
            <div className="max-w-2xl rounded-2xl border border-app-border bg-app-bg/55 p-5 backdrop-blur md:p-7">
              <p className="accent-label text-[11px] text-app-primary">Fine Dining • Smart Ordering</p>
              <h1 className="mt-3 text-5xl leading-[0.95] md:text-7xl">{restaurant?.name ?? "Pablo Resto"}</h1>
              <p className="mt-4 text-sm text-app-text-muted md:text-base">
                {restaurant?.tagline ??
                  "An elevated restaurant experience where beautiful spaces, chef-led cuisine, and seamless digital ordering meet."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/menu/external">
                  <Button>View Full Menu</Button>
                </Link>
              </div>

              <div className="mt-6 grid gap-2 text-sm text-app-text-muted sm:grid-cols-2">
                <p className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-app-primary" />
                  {restaurant?.address ?? "Bonanjo, Douala"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-app-primary" />
                  {restaurant?.openingHours ?? "Mon-Sun · 11:00 - 23:00"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-app-border bg-app-surface/80 p-5">
          <Sparkles className="h-5 w-5 text-app-primary" />
          <h2 className="mt-3 text-2xl">Luxury Atmosphere</h2>
          <p className="mt-2 text-sm text-app-text-muted">
            Every table is designed for comfort and elegance, from warm textures to editorial lighting.
          </p>
        </article>
        <article className="rounded-2xl border border-app-border bg-app-surface/80 p-5">
          <UtensilsCrossed className="h-5 w-5 text-app-primary" />
          <h2 className="mt-3 text-2xl">Chef-Crafted Menu</h2>
          <p className="mt-2 text-sm text-app-text-muted">
            Seasonal ingredients, refined flavor profiles, and plating that honors every detail.
          </p>
        </article>
        <article className="rounded-2xl border border-app-border bg-app-surface/80 p-5">
          <Phone className="h-5 w-5 text-app-primary" />
          <h2 className="mt-3 text-2xl">Fast Ordering Flow</h2>
          <p className="mt-2 text-sm text-app-text-muted">
            Dine-in QR service plus external delivery flow with contact capture and live kitchen updates.
          </p>
        </article>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="accent-label text-[11px] text-app-primary">Inside The Space</p>
            <h2 className="mt-1 text-4xl">A Restaurant You Feel Before You Taste</h2>
          </div>
          <Link href="/order" className="text-sm text-app-primary">
            Book or Order
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-12">
          <article className="group relative min-h-[380px] overflow-hidden rounded-2xl border border-app-border md:col-span-7">
            <Image src={ambienceGallery[0].src} alt={ambienceGallery[0].title} fill className="object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-app-bg via-app-bg/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl">{ambienceGallery[0].title}</h3>
              <p className="mt-1 max-w-md text-sm text-app-text-muted">{ambienceGallery[0].description}</p>
            </div>
          </article>

          <div className="grid gap-3 md:col-span-5">
            {ambienceGallery.slice(1).map((photo) => (
              <article key={photo.title} className="group relative min-h-[184px] overflow-hidden rounded-2xl border border-app-border">
                <Image src={photo.src} alt={photo.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-app-bg via-app-bg/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl">{photo.title}</h3>
                  <p className="mt-0.5 text-xs text-app-text-muted">{photo.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-4xl">Menu Spotlight</h2>
          <Link href="/menu/external" className="text-sm text-app-primary">
            Explore all dishes
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {featuredItems.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-2xl border border-app-border bg-app-surface/80">
              <div className="relative aspect-[16/11]">
                <Image
                  src={item.image || "/images/food-placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-app-bg/80 to-transparent" />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-2xl">{item.name}</h3>
                <p className="line-clamp-2 text-sm text-app-text-muted">{item.description}</p>
                <p className="text-sm font-semibold text-app-primary">
                  {formatCurrency(item.price, restaurant?.currency ?? "FCFA")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-2xl border border-app-border bg-app-surface/80 p-5">
            <p className="inline-flex items-center gap-1 text-app-primary">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={`${review.id}-${index}`} className="h-4 w-4 fill-current" />
              ))}
            </p>
            <p className="mt-3 text-sm text-app-text-muted">“{review.message}”</p>
            <p className="mt-3 text-sm font-semibold">{review.author}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border border-app-border bg-app-surface/85 p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="accent-label text-[11px] text-app-primary">Reserve • Dine • Repeat</p>
            <h2 className="mt-2 text-4xl">Ready for your next dining experience?</h2>
            <p className="mt-2 text-sm text-app-text-muted">
              Visit us in person with table-side QR ordering, or place an external delivery order with full contact support.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/menu/external">
                <Button>Browse Menu</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-app-border bg-app-bg/60 p-4 text-sm text-app-text-muted">
            <p className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-app-primary" />
              {restaurant?.phone ?? "+237 6 00 00 00 00"}
            </p>
            <p className="mt-2 inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-app-primary" />
              {restaurant?.address ?? "Bonanjo, Douala"}
            </p>
            <p className="mt-2 inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-app-primary" />
              {restaurant?.openingHours ?? "Mon-Sun · 11:00 - 23:00"}
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
