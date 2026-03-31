import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { id: "demo-restaurant" },
    update: {},
    create: {
      id: "demo-restaurant",
      name: "Maison Saffron",
      tagline: "A luxury table experience, now one scan away.",
      currency: "FCFA",
      primaryColor: "#C9A96E",
      phone: "+237 6 00 00 00 00",
      email: "hello@maisonsaffron.com",
      address: "Bonanjo, Douala",
      openingHours: "Mon-Sun · 11:00 - 23:00",
      logo: "/images/restaurant-logo.svg"
    }
  });

  const categories = [
    { name: "Starters", order: 1 },
    { name: "Mains", order: 2 },
    { name: "Drinks", order: 3 },
    { name: "Desserts", order: 4 }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { restaurantId_name: { restaurantId: restaurant.id, name: category.name } },
      update: { order: category.order },
      create: { ...category, restaurantId: restaurant.id }
    });
  }

  const categoryMap = await prisma.category.findMany({
    where: { restaurantId: restaurant.id }
  });

  const getCategoryId = (name: string) => categoryMap.find((category) => category.name === name)!.id;

  const menuItems = [
    ["Truffle Plantain Chips", "Thin plantain crisps with truffle sea salt", 6500, "Starters", "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"],
    ["Smoked Beef Suya Bites", "Pepper-spiced skewers with tamarind glaze", 9000, "Starters", "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd"],
    ["Seared Sea Bass", "Lemon butter sea bass with braised greens", 18000, "Mains", "https://images.unsplash.com/photo-1467003909585-2f8a72700288"],
    ["Braised Lamb Shoulder", "Slow-cooked lamb with cassava mash", 21000, "Mains", "https://images.unsplash.com/photo-1544025162-d76694265947"],
    ["Tropical Citrus Cooler", "Mango, pineapple, and ginger infusion", 4500, "Drinks", "https://images.unsplash.com/photo-1544145945-f90425340c7e"],
    ["Cold Brew Hibiscus", "House-steeped hibiscus with orange zest", 4000, "Drinks", "https://images.unsplash.com/photo-1544145945-f90425340c7e"],
    ["Dark Chocolate Dome", "Warm center with vanilla bean cream", 7000, "Desserts", "https://images.unsplash.com/photo-1551024601-bec78aea704b"],
    ["Caramelized Pineapple Tart", "Buttery tart with spiced syrup", 6500, "Desserts", "https://images.unsplash.com/photo-1488477181946-6428a0291777"]
  ] as const;

  for (const [name, description, price, categoryName, image] of menuItems) {
    await prisma.menuItem.upsert({
      where: {
        id: `${name.toLowerCase().replace(/\s+/g, "-")}-${restaurant.id}`
      },
      update: {
        description,
        price,
        image,
        available: true,
        categoryId: getCategoryId(categoryName)
      },
      create: {
        id: `${name.toLowerCase().replace(/\s+/g, "-")}-${restaurant.id}`,
        name,
        description,
        price,
        image,
        available: true,
        categoryId: getCategoryId(categoryName),
        restaurantId: restaurant.id
      }
    });
  }

  for (let i = 1; i <= 12; i += 1) {
    await prisma.table.upsert({
      where: { id: `table-${restaurant.id}-${i}` },
      update: {},
      create: {
        id: `table-${restaurant.id}-${i}`,
        number: i,
        capacity: i <= 4 ? 2 : i <= 10 ? 4 : 6,
        restaurantId: restaurant.id
      }
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@restaurant.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "supersecurepassword";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: await hash(adminPassword, 10),
      name: "Restaurant Admin"
    },
    create: {
      email: adminEmail,
      name: "Restaurant Admin",
      passwordHash: await hash(adminPassword, 10)
    }
  });

  await prisma.review.deleteMany({
    where: { restaurantId: restaurant.id }
  });

  await prisma.review.createMany({
    data: [
      { author: "Nadine K.", message: "Elegant service and beautifully plated food.", rating: 5, restaurantId: restaurant.id },
      { author: "Michael T.", message: "Ordering from the table QR was effortless.", rating: 5, restaurantId: restaurant.id },
      { author: "Arielle B.", message: "Great ambiance, fast kitchen turnaround.", rating: 4, restaurantId: restaurant.id }
    ]
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
