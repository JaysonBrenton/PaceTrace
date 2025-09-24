import type { ReactNode } from "react";

interface ErrorBannerProps {
  children: ReactNode;
}

export function ErrorBanner({ children }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-[hsl(var(--color-danger))] bg-[hsla(var(--color-danger)/0.08)] px-4 py-3 text-sm font-medium text-[hsl(var(--color-danger))]"
    >
      {children}
    </div>
  );
}
