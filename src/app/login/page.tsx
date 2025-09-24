import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Authenticate to access PaceTrace telemetry and coaching tools.",
};

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsla(var(--color-accent)/0.32),transparent_65%)]"
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-[radial-gradient(circle_at_top,hsl(var(--color-accent)/0.16),transparent_70%)]" aria-hidden />

      <div className="relative mx-auto flex w-full flex-1 flex-col lg:flex-row">
        <aside className="relative isolate hidden w-full max-w-xl flex-1 flex-col justify-between bg-[radial-gradient(circle_at_top,hsla(var(--color-accent)/0.3),transparent_70%)] px-10 py-16 text-left text-[hsl(var(--color-bg))] lg:flex">
          <div className="absolute inset-6 -z-10 rounded-[40px] border border-white/15 bg-[hsla(var(--color-accent-muted)/0.85)] blur-3xl" aria-hidden />

          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/60">Pacetrace</p>
            <h1 className="text-4xl font-semibold leading-tight text-white">Log in with clarity and confidence</h1>
            <p className="text-base text-white/80">
              Welcome back to the mission control of your training data. Pick up insights where you left off with the same
              precision we bring to telemetry.
            </p>
          </div>

          <dl className="grid gap-6 text-sm text-white/80">
            <div className="rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
              <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Uptime</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">99.98% monitored</dd>
              <p className="mt-2 text-sm text-white/70">Stay confident—your sessions sync securely in real time.</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
              <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Support</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">Under 5 min</dd>
              <p className="mt-2 text-sm text-white/70">Get a response from operations whenever you need a hand.</p>
            </div>
          </dl>

          <div className="space-y-4 text-sm text-white/70">
            <p className="font-medium text-white">Security checklist</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-flex h-2 w-2 rounded-full bg-[hsl(var(--color-accent))]" />
                <span>Single sign-on with Google, Apple, Facebook, or secure email.</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-flex h-2 w-2 rounded-full bg-[hsl(var(--color-accent))]" />
                <span>Session alerts and device history help you monitor access.</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-flex h-2 w-2 rounded-full bg-[hsl(var(--color-accent))]" />
                <span>Privacy-first—data encrypted in transit and at rest.</span>
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex w-full flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-12">
          <div className="relative w-full max-w-lg">
            <div className="space-y-10 rounded-[32px] bg-[hsla(var(--color-card)/0.88)] p-10 shadow-[0_30px_80px_-40px_hsla(var(--color-accent)/0.55)] ring-1 ring-[hsla(var(--color-card-border)/0.65)] backdrop-blur-xl">
              <div className="space-y-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-foreground/70">Welcome back</p>
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Sign in to continue tracking the pace</h2>
                <p className="text-sm text-foreground/70">
                  Choose the method that works best for today. We’ll keep your team’s telemetry secure and in sync.
                </p>
              </div>

              <LoginForm />
            </div>

            <div className="mt-6 space-y-2 text-center text-xs text-foreground/60">
              <p>
                New to PaceTrace?{" "}
                <Link className="font-medium text-foreground transition hover:text-[hsl(var(--color-accent))]" href="#">
                  Request early access
                </Link>
              </p>
              <p>
                Having trouble logging in?{" "}
                <Link className="font-medium text-foreground transition hover:text-[hsl(var(--color-accent))]" href="mailto:ops@pacetrace.io">
                  Contact operations
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
