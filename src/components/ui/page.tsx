import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Page({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-theme="midnight"
      className={cn("flex min-h-screen flex-col bg-bg text-fg", className)}
      {...props}
    />
  );
}
