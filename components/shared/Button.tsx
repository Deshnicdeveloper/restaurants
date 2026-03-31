import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-app-primary text-app-bg shadow-gold hover:brightness-110 focus-visible:ring-app-primary/40",
  outline:
    "border border-app-primary/70 bg-transparent text-app-primary hover:bg-app-primary/10 focus-visible:ring-app-primary/30",
  ghost: "text-app-text hover:bg-white/5 focus-visible:ring-white/20",
  danger: "bg-app-danger text-white hover:bg-app-danger/80 focus-visible:ring-app-danger/40"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
