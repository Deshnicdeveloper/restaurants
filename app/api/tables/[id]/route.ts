import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const table = await prisma.table.update({
    where: { id: params.id },
    data: {
      number: body?.number ? Number(body.number) : undefined,
      capacity: body?.capacity ? Number(body.capacity) : undefined,
      status: body?.status
    }
  });

  return NextResponse.json({ table });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.table.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
