import type { ReactNode } from "react";

interface DividerProps {
  children: ReactNode;
}

export function Divider({ children }: DividerProps) {
  return (
    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
      <span className="h-px flex-1 bg-muted" aria-hidden />
      {children}
      <span className="h-px flex-1 bg-muted" aria-hidden />
    </div>
  );
}
