import { forwardRef } from "react";
import type { HTMLAttributes, HTMLDivElement } from "react";

import { cn } from "@/lib/cn";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-border/70 bg-surface/95 p-8 shadow-lg", className)}
      {...props}
    />
  );
});
