import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  helper?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, helper, children, footer }: AuthCardProps) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[31.25rem] overflow-hidden rounded-[32px] border border-border/70 bg-card/95 shadow-card backdrop-blur-sm">
        <div className="space-y-10 p-8 sm:p-10">
          <div className="space-y-3 text-center">
            <h1 className="text-[1.875rem] font-semibold tracking-tight sm:text-[2rem]">{title}</h1>
            {helper ? <p className="text-base text-muted-foreground">{helper}</p> : null}
          </div>
          {children}
        </div>
      </div>
      {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
    </section>
  );
}
