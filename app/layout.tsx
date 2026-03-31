import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Montserrat } from "next/font/google";
import type { CSSProperties } from "react";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { getRestaurant } from "@/lib/data";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

const accent = Montserrat({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["500", "600"]
});

export const metadata: Metadata = {
  title: "Maison Saffron | QR Restaurant Ordering",
  description: "Premium mobile-first QR restaurant ordering experience.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/images/restaurant-logo.svg"
  }
};

export const dynamic = "force-dynamic";

function darkenHexColor(hex: string, factor = 0.7) {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return "#8A6F42";
  }
  const red = Math.max(0, Math.min(255, Math.round(parseInt(clean.slice(0, 2), 16) * factor)));
  const green = Math.max(0, Math.min(255, Math.round(parseInt(clean.slice(2, 4), 16) * factor)));
  const blue = Math.max(0, Math.min(255, Math.round(parseInt(clean.slice(4, 6), 16) * factor)));
  return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const restaurant = await getRestaurant();
  const primaryColor = restaurant?.primaryColor ?? "#C9A96E";
  const primaryMuted = darkenHexColor(primaryColor, 0.7);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${accent.variable} antialiased`}
        style={
          {
            "--color-primary": primaryColor,
            "--color-primary-muted": primaryMuted
          } as CSSProperties
        }
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
