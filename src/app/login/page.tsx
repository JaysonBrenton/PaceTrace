import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Authenticate to access PaceTrace telemetry and coaching tools.",
};

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsla(var(--color-accent)/0.35),transparent_65%)]"
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-[radial-gradient(circle_at_top,hsl(var(--color-accent)/0.2),transparent_70%)]" aria-hidden />
      <div className="relative w-full max-w-lg">
        <div className="space-y-8 rounded-[32px] bg-[hsla(var(--color-card)/0.88)] p-10 text-foreground shadow-[0_30px_80px_-40px_hsla(var(--color-accent)/0.6)] ring-1 ring-[hsla(var(--color-card-border)/0.6)] backdrop-blur-xl">
          <div className="space-y-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-foreground/70">PaceTrace</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Log in to keep the pace</h1>
            <p className="text-sm text-foreground/70">
              Pick the quickest route back into telemetry insights and team coordination.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-8 text-center text-xs text-foreground/60">
          Need an invite?{" "}
          <Link className="font-medium text-foreground transition hover:text-[hsl(var(--color-accent))]" href="#">
            Request early access
          </Link>
        </p>
      </div>
    </div>
  );
}
