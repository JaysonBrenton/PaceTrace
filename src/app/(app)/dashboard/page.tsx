import type { Metadata } from "next";

import { getLogger } from "@/lib/logging";
import { trackEvent } from "@/lib/telemetry";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Live health of race programs, imports, and crew readiness.",
};

const mockMetrics = [
  {
    label: "Active heats",
    value: 6,
    change: "+2 vs last round",
  },
  {
    label: "Telemetry uptime",
    value: "99.7%",
    change: "+0.4%",
  },
  {
    label: "Crew callouts",
    value: 32,
    change: "8 acknowledged",
  },
];

export default function DashboardPage() {
  getLogger().info("dashboard.viewed");
  trackEvent("dashboard.render");

  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">Race control overview</h1>
        <p className="text-sm text-muted-foreground">
          Keep tabs on laps, alerts, and coaching notes from practice through mains.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-card"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground/80">{metric.change}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Import backlog
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {["LiveRC", "Manual telemetry", "Coaching notes"].map((queue) => (
              <li key={queue} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                <span>{queue}</span>
                <span className="text-xs uppercase tracking-[0.24em] text-accent">Healthy</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Crew radar
          </h2>
          <div className="mt-4 space-y-4">
            {["Pit lane", "Spotter deck", "Data review"].map((station) => (
              <div key={station} className="rounded-xl border border-border/60 bg-card/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">{station}</p>
                <p className="mt-2 text-sm text-foreground">
                  All clear. No escalations in the last 15 minutes.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
