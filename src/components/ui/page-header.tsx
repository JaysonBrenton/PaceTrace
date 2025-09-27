import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Muted } from "./muted";

interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn("mx-auto w-full max-w-xl space-y-3 text-center", className)}
      {...props}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-caps text-fg-subtle">{eyebrow}</p>
      ) : null}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description ? <Muted className="text-base">{description}</Muted> : null}
      </div>
    </header>
  );
}
