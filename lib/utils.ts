import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, currency = "FCFA") {
  return `${currency} ${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0
  }).format(value)}`;
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
