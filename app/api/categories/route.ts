import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRestaurant } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const restaurant = await getRestaurant();
  if (!restaurant) {
    return NextResponse.json({ categories: [] });
  }

  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { order: "asc" }
  });

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await getRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const body = await request.json();
  const category = await prisma.category.create({
    data: {
      name: String(body?.name),
      order: Number(body?.order ?? 0),
      restaurantId: restaurant.id
    }
  });

  return NextResponse.json({ category }, { status: 201 });
}

export async function DELETE(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
