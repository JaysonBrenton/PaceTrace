import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Label } from "./label";
import { Muted } from "./muted";

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  htmlFor: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  errorId?: string;
  requiredIndicator?: ReactNode;
  children: ReactNode;
}

export function FormField({
  htmlFor,
  label,
  description,
  error,
  errorId,
  requiredIndicator,
  children,
  className,
  ...props
}: FormFieldProps) {
  const resolvedErrorId = error ? errorId ?? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-baseline justify-between gap-4">
        <Label htmlFor={htmlFor} className="flex items-center gap-1">
          {label}
          {requiredIndicator ? <span className="text-xs font-semibold text-fg-subtle">{requiredIndicator}</span> : null}
        </Label>
        {description ? <Muted className="text-xs">{description}</Muted> : null}
      </div>
      {children}
      {error ? (
        <p id={resolvedErrorId} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
