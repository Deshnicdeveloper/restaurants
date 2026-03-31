import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRestaurant } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const restaurant = await getRestaurant();
  if (!restaurant) {
    return NextResponse.json({ tables: [] });
  }

  const tables = await prisma.table.findMany({
    where: {
      restaurantId: restaurant.id
    },
    orderBy: { number: "asc" }
  });

  return NextResponse.json({ tables });
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
  const number = Number(body?.number);
  const capacity = Number(body?.capacity ?? 4);

  if (!number) {
    return NextResponse.json({ error: "Table number required" }, { status: 400 });
  }

  const table = await prisma.table.create({
    data: {
      number,
      capacity,
      restaurantId: restaurant.id
    }
  });

  return NextResponse.json({ table }, { status: 201 });
}
