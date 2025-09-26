import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  helper?: string;
  children: ReactNode;
  footerSlot?: ReactNode;
}

export function AuthCard({ title, helper, children, footerSlot }: AuthCardProps) {
  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-background p-8 shadow-card">
      <div className="space-y-3 text-center">
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-foreground">{title}</h1>
        {helper ? <p className="text-base text-muted">{helper}</p> : null}
      </div>
      <div className="mt-8 space-y-6">{children}</div>
      {footerSlot ? <div className="mt-8 text-center text-sm text-muted">{footerSlot}</div> : null}
    </section>
  );
}
