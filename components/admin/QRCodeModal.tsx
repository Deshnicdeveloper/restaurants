"use client";

import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";

export function QRCodeModal({
  open,
  tableNumber,
  dataUrl,
  menuUrl,
  error,
  onClose
}: {
  open: boolean;
  tableNumber: number | null;
  dataUrl: string | null;
  menuUrl: string | null;
  error?: string | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      title={`Table ${tableNumber ?? ""} QR`}
      onClose={onClose}
      actions={
        <>
          {dataUrl ? (
            <a href={dataUrl} download={`table-${tableNumber}.png`}>
              <Button>Download PNG</Button>
            </a>
          ) : null}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      {dataUrl ? (
        <div className="space-y-3 text-center">
          <img src={dataUrl} alt={`Table ${tableNumber} QR`} className="mx-auto h-52 w-52 rounded-xl bg-white p-2" />
          <p className="text-xs text-app-text-muted break-all">{menuUrl}</p>
        </div>
      ) : error ? (
        <p className="text-app-danger">{error}</p>
      ) : (
        <p>Generating QR code...</p>
      )}
    </Modal>
  );
}
