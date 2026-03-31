import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const badgeStyles: Record<BadgeVariant, string> = {
  default: "border border-app-border bg-app-surface text-app-text",
  success: "bg-app-success/20 text-app-success border border-app-success/30",
  warning: "bg-app-warning/20 text-app-warning border border-app-warning/30",
  danger: "bg-app-danger/20 text-app-danger border border-app-danger/30"
};

export function Badge({
  children,
  variant = "default",
  className
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide", badgeStyles[variant], className)}>
      {children}
    </span>
  );
}
