import Link from "next/link";

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-hero-top"
      />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-card/60 text-sm font-semibold uppercase tracking-caps-tight text-accent">
              PT
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-caps-wider text-muted-foreground">Pacetrace</p>
              <p className="text-xs text-muted-foreground/70">Telemetry coaching for RC race teams</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <Link className="rounded-full border border-transparent px-4 py-2 transition hover:border-border/80 hover:text-foreground" href="#features">
              Features
            </Link>
            <Link className="rounded-full border border-transparent px-4 py-2 transition hover:border-border/80 hover:text-foreground" href="#operations">
              Operations
            </Link>
            <Link
              className="rounded-full border border-border/70 bg-card/70 px-4 py-2 text-foreground transition hover:border-accent/60 hover:text-accent"
              href="/login"
            >
              Log in
            </Link>
          </nav>
        </header>

        <section className="grid gap-12 pb-6 pt-4 md:grid-cols-2 md:items-center" id="features">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-caps-wider text-muted-foreground">
              Multi-tenant by design
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Lap data, telemetry, and coaching notes—finally in one lane.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground">
                PaceTrace ingests LiveRC events, syncs race-day notes, and delivers actionable callouts to the pits. Build repeatable race programs with observability baked in from heat practice to mains.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 font-semibold text-background transition hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Access your workspace
              </Link>
              <Link
                href="#operations"
                className="inline-flex items-center justify-center rounded-lg border border-border/70 bg-card/70 px-5 py-3 font-semibold text-foreground transition hover:border-accent/60 hover:text-accent"
              >
                Explore the ops kit
              </Link>
            </div>
            <dl className="grid gap-6 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                <dt className="text-xs font-semibold uppercase tracking-caps-wide text-muted-foreground/80">Live metrics</dt>
                <dd className="mt-3 text-2xl font-semibold text-foreground">Sub-200ms lap deltas</dd>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                <dt className="text-xs font-semibold uppercase tracking-caps-wide text-muted-foreground/80">Insights</dt>
                <dd className="mt-3 text-2xl font-semibold text-foreground">Auto-tagged stumbles</dd>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                <dt className="text-xs font-semibold uppercase tracking-caps-wide text-muted-foreground/80">Admin</dt>
                <dd className="mt-3 text-2xl font-semibold text-foreground">Quota-aware tenants</dd>
              </div>
            </dl>
          </div>

          <div className="relative rounded-hero border border-border/60 bg-card/80 p-8 shadow-lg md:justify-self-end md:max-w-sm">
            <div className="absolute inset-0 -z-10 rounded-hero bg-hero-corner" aria-hidden />
            <div className="space-y-6 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-semibold uppercase tracking-caps-wide text-muted-foreground/70">Heat tracker</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">Round 3 — Pro Buggy</p>
              </div>
              <div className="space-y-3">
                {["Lap 18", "Lap 19", "Lap 20"].map((lap, index) => (
                  <div key={lap} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-caps-tight text-muted-foreground/70">{lap}</p>
                      <p className="text-base font-semibold text-foreground">{index === 1 ? "Fast lap" : "Consistent"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-caps-tight text-muted-foreground/70">Delta</p>
                      <p className="text-lg font-semibold text-success">{index === 1 ? "-0.48s" : "-0.12s"}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-caps-wide text-muted-foreground/70">Coach note</p>
                <p className="mt-2 text-sm text-foreground">
                  &ldquo;Hold the tighter line through the double-double. Tires are finally in—push next lap.&rdquo; — Pit lead
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-10 pb-12" id="operations">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Operational readiness out of the box</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Health endpoints, audit trails, and rate-limited imports are scaffolded so your crew can trust the data while you iterate on new coaching insights.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Health & readiness", "LiveRC import queue", "Tenant permissions"].map((item) => (
              <div key={item} className="rounded-2xl border border-border/60 bg-card/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-caps-wide text-muted-foreground/70">{item}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Instrumented endpoints with structured logging and alerts for the parts of PaceTrace that keep race day humming.
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-border/50 py-6 text-xs text-muted-foreground/80 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} PaceTrace. Built for RC racing teams who move fast.</p>
          <div className="flex gap-4">
            <Link href="#">Status</Link>
            <Link href="#">Docs</Link>
            <Link href="/login">Sign in</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
