import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export function PrimaryButton({ children, isLoading, disabled, className, ...props }: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-background transition hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/40 disabled:cursor-not-allowed disabled:opacity-70 ${
        className ?? ""
      }`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex h-5 w-5 items-center justify-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-foreground" aria-hidden />
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
