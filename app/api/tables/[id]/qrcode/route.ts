import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";
import { qrToDataUrl } from "@/lib/qrcode";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const table = await prisma.table.findUnique({
      where: { id: params.id },
      include: { restaurant: true }
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const menuUrl = `${getBaseUrl()}/menu/${table.id}`;
    const dataUrl = await qrToDataUrl(menuUrl);

    await prisma.table.update({
      where: { id: table.id },
      // Persist the short menu URL instead of the full base64 image payload.
      data: { qrCodeUrl: menuUrl }
    });

    return NextResponse.json({
      tableId: table.id,
      tableNumber: table.number,
      menuUrl,
      dataUrl
    });
  } catch (error) {
    console.error("QR generation failed:", error);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
