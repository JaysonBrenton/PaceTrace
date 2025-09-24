import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Authenticate to access PaceTrace telemetry and coaching tools.",
};

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsla(var(--color-accent)/0.35),transparent_70%)]"
      />
      <div className="w-full max-w-md space-y-10">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            PaceTrace
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to review lap deltas, annotate heats, and keep your team aligned on race-day decisions.
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-card backdrop-blur-xl">
          <form className="space-y-6" method="post" data-analytics-event="auth:submit">
            <div className="grid gap-2 text-left">
              <label className="text-sm font-medium text-foreground/80" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))]"
                placeholder="you@teamradio.com"
              />
            </div>

            <div className="grid gap-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80" htmlFor="password">
                  Password
                </label>
                <Link className="text-xs font-medium text-accent hover:text-[hsl(var(--color-accent-muted))]" href="#">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-3 text-base font-semibold text-background transition hover:bg-[hsl(var(--color-accent-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-analytics-event="auth:submit:primary"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 space-y-3 text-left text-xs text-muted-foreground">
            <p className="font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">What you get</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-success" aria-hidden />
                Live lap comparisons across heats and mains
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-success" aria-hidden />
                Telemetry callouts delivered to pit tablets
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-success" aria-hidden />
                Secure multi-tenant workspace for your crew
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          New to PaceTrace?{" "}
          <Link className="font-medium text-foreground hover:text-accent" href="#">
            Request early access
          </Link>
        </p>
      </div>
    </div>
  );
}
