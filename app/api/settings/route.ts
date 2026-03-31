import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRestaurant } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const restaurant = await getRestaurant();
  return NextResponse.json({ restaurant });
}

export async function PATCH(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const body = await request.json();

  const updated = await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      name: body?.name,
      tagline: body?.tagline,
      logo: body?.logo,
      currency: body?.currency,
      primaryColor: body?.primaryColor,
      phone: body?.phone,
      email: body?.email,
      address: body?.address,
      openingHours: body?.openingHours
    }
  });

  return NextResponse.json({ restaurant: updated });
}
