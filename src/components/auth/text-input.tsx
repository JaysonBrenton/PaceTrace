import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  action?: ReactNode;
  description?: string;
  error?: string | null;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ id, label, action, description, error, className, ...props }, ref) => {
    const baseId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    const describedBy = [description ? `${baseId}-description` : undefined, error ? `${baseId}-error` : undefined]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      <div className="grid gap-3 text-left">
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground" htmlFor={baseId}>
            {label}
          </label>
          {action}
        </div>
        <input
          ref={ref}
          id={baseId}
          className={
            "block w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))] disabled:opacity-70 " +
            (className ?? "")
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy.length > 0 ? describedBy : undefined}
          {...props}
        />
        {description ? (
          <p className="text-sm text-muted-foreground" id={`${baseId}-description`}>
            {description}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm font-medium text-[hsl(var(--color-danger))]" id={`${baseId}-error`} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
