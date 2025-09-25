import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Authenticate to access PaceTrace telemetry and coaching tools.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(var(--color-accent)/0.2),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-10%] h-[420px] bg-[radial-gradient(circle_at_top_right,hsla(var(--color-accent-2)/0.25),transparent_65%)]"
      />

      <header className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-12 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          PaceTrace — the one-stop lap logic shop.
        </p>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-8 sm:px-6">
        <section className="w-full max-w-xl">
          <div className="overflow-hidden rounded-[32px] border border-border/70 bg-card/95 shadow-card backdrop-blur-sm">
            <div className="space-y-10 p-10 sm:p-12">
              <div className="space-y-3 text-center">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Sign in</h1>
                <p className="text-base text-muted-foreground">Access your PaceTrace data.</p>
              </div>

              <LoginForm />

              <div className="rounded-3xl border border-border/60 bg-muted/20 p-4 text-left text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Demo environment</p>
                <p className="mt-1">
                  Use <span className="font-medium text-foreground">driver@pacetrace.app</span> with the password
                  <span className="font-medium text-foreground"> pitlane</span> while running locally. Override these with
                  <code className="mx-1 rounded bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">AUTH_DEMO_EMAIL</code>
                  and
                  <code className="mx-1 rounded bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">AUTH_DEMO_PASSWORD</code>
                  in your environment to test different credentials.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <Link className="font-semibold text-accent transition hover:text-accent-muted" href="/register">
              Create one
            </Link>
          </p>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 bg-card/70 py-8 backdrop-blur-sm">
        <p className="mx-auto max-w-4xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          © PaceTrace •{" "}
          <Link className="font-medium text-accent transition hover:text-accent-muted" href="/legal/privacy">
            Privacy
          </Link>{" "}
          •{" "}
          <Link className="font-medium text-accent transition hover:text-accent-muted" href="/legal/terms">
            Terms
          </Link>{" "}
          • <span className="font-semibold text-foreground">See the data. Find the pace.</span>
        </p>
      </footer>
    </div>
  );
}
