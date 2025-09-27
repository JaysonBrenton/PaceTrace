import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      data-invalid={invalid ? "true" : undefined}
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-border/70 bg-bg-subtle/80 px-4 py-2.5 text-sm text-fg",
        "placeholder:text-fg-subtle transition focus-visible:border-accent focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "data-[invalid=true]:border-danger data-[invalid=true]:focus-visible:ring-danger",
        className,
      )}
      {...props}
    />
  );
});
