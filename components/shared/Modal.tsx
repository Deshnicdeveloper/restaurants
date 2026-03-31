"use client";

import { cn } from "@/lib/utils";

export function Modal({
  open,
  title,
  children,
  actions,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center" onClick={onClose}>
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-app-border bg-app-surface p-4 shadow-2xl",
          "rise-in"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="mt-3 text-sm text-app-text-muted">{children}</div>
        {actions ? <div className="mt-5 flex justify-end gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
