import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-strong focus-visible:ring-accent",
  secondary: "bg-surface text-fg hover:bg-elevated focus-visible:ring-border",
  destructive: "bg-danger text-inverted hover:bg-danger-strong focus-visible:ring-danger",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", disabled, isLoading, children, ...props },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-contrast/30 border-t-accent-contrast" /> : null}
      <span className={cn(isLoading ? "opacity-90" : undefined)}>{children}</span>
    </button>
  );
});
