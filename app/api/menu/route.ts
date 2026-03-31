import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMenuForRestaurant } from "@/lib/data";
import { getRestaurant } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const result = await getMenuForRestaurant();

  if (!result) {
    return NextResponse.json({ categories: [], restaurant: null });
  }

  return NextResponse.json(result);
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
  const menuItem = await prisma.menuItem.create({
    data: {
      name: String(body?.name),
      description: body?.description ? String(body.description) : null,
      price: Number(body?.price),
      image: body?.image ? String(body.image) : null,
      available: body?.available ?? true,
      categoryId: String(body?.categoryId),
      restaurantId: restaurant.id
    }
  });

  return NextResponse.json({ menuItem }, { status: 201 });
}

export async function PATCH(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body?.id);

  const menuItem = await prisma.menuItem.update({
    where: { id },
    data: {
      name: body?.name,
      description: body?.description,
      price: body?.price ? Number(body.price) : undefined,
      image: body?.image,
      available: typeof body?.available === "boolean" ? body.available : undefined,
      categoryId: body?.categoryId
    }
  });

  return NextResponse.json({ menuItem });
}

export async function DELETE(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
