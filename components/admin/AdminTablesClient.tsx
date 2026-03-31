"use client";

import { useState } from "react";
import { TableGrid } from "@/components/admin/TableGrid";

type Table = {
  id: string;
  number: number;
  capacity: number;
  status: "FREE" | "OCCUPIED";
};

export function AdminTablesClient({ initialTables }: { initialTables: Table[] }) {
  const [tables, setTables] = useState(initialTables);

  async function reload() {
    const response = await fetch("/api/tables", { cache: "no-store" });
    const payload = await response.json();
    setTables(payload.tables);
  }

  return (
    <TableGrid
      tables={tables}
      onReload={reload}
      onDelete={async (tableId) => {
        await fetch(`/api/tables/${tableId}`, { method: "DELETE" });
        await reload();
      }}
      onCreate={async (number, capacity) => {
        await fetch("/api/tables", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number, capacity })
        });
        await reload();
      }}
    />
  );
}
