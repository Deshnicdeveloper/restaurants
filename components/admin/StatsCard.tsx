import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  helper,
  className
}: {
  title: string;
  value: string;
  helper?: string;
  className?: string;
}) {
  return (
    <article className={cn("rounded-2xl border border-app-border bg-app-surface/80 p-4", className)}>
      <p className="accent-label text-[11px] text-app-text-muted">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {helper ? <p className="mt-1 text-xs text-app-text-muted">{helper}</p> : null}
    </article>
  );
}
