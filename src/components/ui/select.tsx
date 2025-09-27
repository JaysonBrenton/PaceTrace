import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      data-invalid={invalid ? "true" : undefined}
      className={cn(
        "flex w-full appearance-none rounded-lg border border-border/70 bg-bg-subtle/80 px-4 py-2.5 text-sm text-fg",
        "transition focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-60",
        "data-[invalid=true]:border-danger data-[invalid=true]:focus-visible:ring-danger",
        className,
      )}
      {...props}
    />
  );
});
