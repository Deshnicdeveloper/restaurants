"use client";

import { useState } from "react";
import { QrCode, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { QRCodeModal } from "@/components/admin/QRCodeModal";

type Table = {
  id: string;
  number: number;
  capacity: number;
  status: "FREE" | "OCCUPIED";
};

const statusVariant: Record<Table["status"], "success" | "warning"> = {
  FREE: "success",
  OCCUPIED: "warning"
};

export function TableGrid({
  tables,
  onDelete,
  onCreate,
  onReload
}: {
  tables: Table[];
  onDelete: (tableId: string) => Promise<void>;
  onCreate: (number: number, capacity: number) => Promise<void>;
  onReload: () => Promise<void>;
}) {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("4");
  const [modalOpen, setModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [menuUrl, setMenuUrl] = useState<string | null>(null);
  const [activeTableNumber, setActiveTableNumber] = useState<number | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  async function generateQr(tableId: string, number: number) {
    setModalOpen(true);
    setActiveTableNumber(number);
    setQrDataUrl(null);
    setMenuUrl(null);
    setQrError(null);

    try {
      const response = await fetch(`/api/tables/${tableId}/qrcode`);
      const text = await response.text();
      const payload = text ? JSON.parse(text) : null;

      if (!response.ok) {
        setQrError(payload?.error ?? "Failed to generate QR code");
        return;
      }

      if (!payload?.dataUrl) {
        setQrError("Unexpected server response while generating QR code");
        return;
      }

      setQrDataUrl(payload.dataUrl);
      setMenuUrl(payload.menuUrl ?? null);
      await onReload();
    } catch (error) {
      console.error("QR generation request failed:", error);
      setQrError("Could not generate QR code right now. Please try again.");
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
        <h2 className="text-2xl">Add table</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={tableNumber}
            onChange={(event) => setTableNumber(event.target.value)}
            placeholder="Table number"
            className="min-h-11 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
          />
          <input
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
            placeholder="Capacity"
            className="min-h-11 rounded-xl border border-app-border bg-app-bg px-3 text-sm outline-none focus:border-app-primary"
          />
          <Button
            onClick={async () => {
              await onCreate(Number(tableNumber), Number(capacity));
              setTableNumber("");
            }}
          >
            Add
          </Button>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <article key={table.id} className="rounded-2xl border border-app-border bg-app-surface/80 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Table {table.number}</h3>
              <Badge variant={statusVariant[table.status]}>{table.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-app-text-muted">Capacity: {table.capacity}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => generateQr(table.id, table.number)}>
                <QrCode className="mr-2 h-4 w-4" /> QR
              </Button>
              <Button variant="danger" onClick={() => onDelete(table.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </article>
        ))}
      </section>

      <QRCodeModal
        open={modalOpen}
        tableNumber={activeTableNumber}
        dataUrl={qrDataUrl}
        menuUrl={menuUrl}
        error={qrError}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
