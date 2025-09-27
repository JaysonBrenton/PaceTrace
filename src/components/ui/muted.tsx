import { forwardRef } from "react";
import type { HTMLAttributes, HTMLParagraphElement } from "react";

import { cn } from "@/lib/cn";

export const Muted = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function Muted(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cn("text-sm text-fg-muted", className)} {...props} />;
});
