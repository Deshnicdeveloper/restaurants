"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MenuSquare, Settings, TableProperties, ClipboardList, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/shared/BottomNav";

const links = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/orders", label: "Orders", icon: <ClipboardList className="h-4 w-4" /> },
  { href: "/admin/tables", label: "Tables", icon: <TableProperties className="h-4 w-4" /> },
  { href: "/admin/menu", label: "Menu", icon: <MenuSquare className="h-4 w-4" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-0 md:grid-cols-[220px_1fr]">
      <aside className="hidden border-r border-app-border p-6 md:block">
        <p className="accent-label text-[11px] text-app-primary">Admin Console</p>
        <h2 className="mt-2 text-3xl">Maison Saffron</h2>

        <nav className="mt-8 space-y-1">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm",
                  active ? "bg-app-primary/15 text-app-primary" : "text-app-text-muted hover:text-app-text"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl border border-app-border px-3 text-sm text-app-text-muted hover:text-app-text"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <div className="p-4 pb-24 md:p-8">{children}</div>

      <BottomNav items={links.slice(0, 4)} />
    </div>
  );
}
