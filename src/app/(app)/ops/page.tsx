import type { Metadata } from "next";

import { PageViewLogger } from "@/components/page-view-logger";

export const metadata: Metadata = {
  title: "Operations",
  description: "Operational readiness, health checks, and service-level instrumentation.",
};

const checks = [
  {
    title: "Ingest service",
    description: "Webhooks processed under 300ms with no retries in the last hour.",
    status: "operational",
  },
  {
    title: "Telemetry fanout",
    description: "Callouts delivered to 12 pit tablets. Zero drops detected.",
    status: "operational",
  },
  {
    title: "Audit ledger",
    description: "Writes delayed. Queuing new spans for replay.",
    status: "degraded",
  },
];

const statusStyles: Record<"operational" | "degraded" | "outage", string> = {
  operational: "bg-success/15 text-success border-success/40",
  degraded: "bg-warning/15 text-warning border-warning/40",
  outage: "bg-destructive/15 text-destructive border-destructive/40",
};

export default function OpsPage() {
  return (
    <>
      <PageViewLogger event="ops.render" message="ops.viewed" />
      <div className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Operational readiness</h1>
          <p className="text-sm text-muted-foreground">
            Instrumented health checks and structured logs keep the pit wall confident.
          </p>
        </header>
        <div className="grid gap-4 lg:grid-cols-2">
          {checks.map((check) => (
            <article
              key={check.title}
              className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-card"
            >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{check.title}</h2>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${statusStyles[check.status]}`}
              >
                {check.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{check.description}</p>
          </article>
          ))}
        </div>
      </div>
    </>
  );
}
