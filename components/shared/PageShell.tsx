import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={cn("mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pb-10", className)}>{children}</main>;
}
